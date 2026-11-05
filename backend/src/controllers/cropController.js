const CropAnalysis = require('../models/CropAnalysis');
const { getGeminiModel } = require('../config/gemini');
const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

const SUPPORTED_CROPS = [
  'maize', 'sorghum', 'beans', 'tomato', 'potato',
  'onion', 'cabbage', 'kale', 'spinach', 'vegetables'
];

const CROP_DISEASES = {
  maize:      ['Maize Streak Virus', 'Northern Leaf Blight', 'Gray Leaf Spot', 'Common Rust', 'Healthy'],
  sorghum:    ['Anthracnose', 'Leaf Blight', 'Smut', 'Rust', 'Healthy'],
  beans:      ['Bean Rust', 'Angular Leaf Spot', 'Anthracnose', 'Bacterial Blight', 'Healthy'],
  tomato:     ['Early Blight', 'Late Blight', 'Leaf Curl Virus', 'Bacterial Spot', 'Healthy'],
  potato:     ['Late Blight', 'Early Blight', 'Black Scurf', 'Bacterial Wilt', 'Healthy'],
  onion:      ['Purple Blotch', 'Downy Mildew', 'White Rot', 'Healthy'],
  cabbage:    ['Black Rot', 'Downy Mildew', 'Clubroot', 'Healthy'],
  kale:       ['Leaf Spot', 'Downy Mildew', 'Black Rot', 'Healthy'],
  spinach:    ['Downy Mildew', 'Leaf Spot', 'Healthy'],
  vegetables: ['Leaf Spot', 'Blight', 'Mildew', 'Rust', 'Healthy']
};

// Build the disease reference block dynamically
const buildDiseaseReference = () =>
  Object.entries(CROP_DISEASES)
    .map(([crop, diseases]) => `  - ${crop}: ${diseases.join(', ')}`)
    .join('\n');

// ─────────────────────────────────────────────
// PROFESSIONAL PROMPT — structured, grounded, strict output
// ─────────────────────────────────────────────
const buildAnalysisPrompt = () => `
You are an expert agricultural plant pathologist assisting smallholder farmers in Turkana County, Kenya.

Analyze the crop image provided and return a diagnosis using ONLY the options listed below.

──────────────────────────────
STEP 1 — IDENTIFY THE CROP
──────────────────────────────
Choose ONE crop type from this list (lowercase):
${SUPPORTED_CROPS.join(', ')}

If the image does not show a crop from this list, set cropType to "unknown".

──────────────────────────────
STEP 2 — IDENTIFY THE DISEASE
──────────────────────────────
Match the visible symptoms to a known disease for the identified crop:

${buildDiseaseReference()}

If the crop appears healthy with no visible symptoms, set disease to "Healthy".
If the image is unclear or unrecognizable, set disease to "unknown".

──────────────────────────────
STEP 3 — ASSESS SEVERITY
──────────────────────────────
Rate disease severity as one of: Low | Medium | High
- Low: Early signs, <25% of plant affected
- Medium: Moderate spread, 25–60% affected
- High: Severe damage, >60% affected or systemic infection
If disease is "Healthy", set severity to "None".

──────────────────────────────
STEP 4 — TREATMENT
──────────────────────────────
Provide 2–3 specific, actionable treatment steps using:
- Locally available inputs in Turkana (e.g., wood ash, neem, soap spray)
- Affordable or government-subsidized agrochemicals if necessary
- Practical actions a subsistence farmer can take immediately

──────────────────────────────
STEP 5 — PREVENTION
──────────────────────────────
Provide 2–3 prevention tips relevant to Turkana's semi-arid climate:
- Focus on cultural practices, resistant varieties, and water management
- Keep advice simple and implementable without specialist equipment

──────────────────────────────
OUTPUT FORMAT — STRICT JSON ONLY
──────────────────────────────
Respond with ONLY a valid JSON object. No markdown. No explanation. No code fences.

{
  "cropType": "<crop from list or 'unknown'>",
  "disease": "<disease name or 'Healthy' or 'unknown'>",
  "severity": "<Low | Medium | High | None>",
  "treatment": "<concise treatment steps as a single string>",
  "prevention": "<concise prevention tips as a single string>"
}
`.trim();

// ─────────────────────────────────────────────
// CONTROLLER: Analyze crop disease from image
// POST /api/crop/analyze  —  Private
// ─────────────────────────────────────────────
const analyzeCropDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    // Upload image to ImageKit
    const uploadedImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: `crop-${Date.now()}.jpg`,
      folder: '/crop-diseases'
    });

    // Build Gemini request
    const model = getGeminiModel();
    const imageBase64 = req.file.buffer.toString('base64');

    const result = await model.generateContent([
      buildAnalysisPrompt(),
      {
        inlineData: {
          data: imageBase64,
          mimeType: req.file.mimetype
        }
      }
    ]);

    const rawText = result.response.text();

    // Parse JSON — strip any accidental markdown fences
    let analysis;
    try {
      const cleaned = rawText.replace(/```json|```/gi, '').trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(cleaned);
    } catch {
      analysis = {
        cropType: 'unknown',
        disease: 'unknown',
        severity: 'Medium',
        treatment: 'Consult your local agricultural extension officer.',
        prevention: 'Practice crop rotation and use certified seeds.'
      };
    }

    // Persist to database
    const cropAnalysis = await CropAnalysis.create({
      userId: req.user._id,
      imageUrl: uploadedImage.url,
      imageKitId: uploadedImage.fileId,
      cropType: analysis.cropType || 'unknown',
      detectedDisease: analysis.disease || 'unknown',
      severity: analysis.severity || 'Medium',
      recommendation: {
        treatment: analysis.treatment,
        prevention: analysis.prevention
      },
      location: req.user.location
    });

    return res.status(201).json({
      success: true,
      data: cropAnalysis
    });

  } catch (error) {
    console.error('[analyzeCropDisease]', error);
    return res.status(500).json({
      success: false,
      message: 'Error analyzing crop image. Please try again.'
    });
  }
};

// ─────────────────────────────────────────────
// CONTROLLER: Update crop analysis
// PUT /api/crop/:id  —  Private
// ─────────────────────────────────────────────
const updateCropAnalysis = async (req, res) => {
  try {
    const analysis = await CropAnalysis.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    if (req.body.cropType)       analysis.cropType = req.body.cropType;
    if (req.body.detectedDisease) analysis.detectedDisease = req.body.detectedDisease;
    if (req.body.severity)       analysis.severity = req.body.severity;
    if (req.body.treatment)      analysis.recommendation.treatment = req.body.treatment;
    if (req.body.prevention)     analysis.recommendation.prevention = req.body.prevention;

    const updated = await analysis.save();
    return res.json({ success: true, data: updated });

  } catch (error) {
    console.error('[updateCropAnalysis]', error);
    return res.status(500).json({ success: false, message: 'Error updating analysis' });
  }
};

// ─────────────────────────────────────────────
// CONTROLLER: Delete crop analysis
// DELETE /api/crop/:id  —  Private
// ─────────────────────────────────────────────
const deleteCropAnalysis = async (req, res) => {
  try {
    const analysis = await CropAnalysis.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    if (analysis.imageKitId) {
      await imagekit.deleteFile(analysis.imageKitId);
    }

    await analysis.deleteOne();
    return res.json({ success: true, message: 'Crop analysis deleted successfully' });

  } catch (error) {
    console.error('[deleteCropAnalysis]', error);
    return res.status(500).json({ success: false, message: 'Error deleting analysis' });
  }
};

// ─────────────────────────────────────────────
// CONTROLLER: Get analysis history for user
// GET /api/crop/history  —  Private
// ─────────────────────────────────────────────
const getCropHistory = async (req, res) => {
  try {
    const analyses = await CropAnalysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: analyses });

  } catch (error) {
    console.error('[getCropHistory]', error);
    return res.status(500).json({ success: false, message: 'Error fetching history' });
  }
};

// ─────────────────────────────────────────────
// CONTROLLER: Get single crop analysis
// GET /api/crop/:id  —  Private
// ─────────────────────────────────────────────
const getCropAnalysis = async (req, res) => {
  try {
    const analysis = await CropAnalysis.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    return res.json({ success: true, data: analysis });

  } catch (error) {
    console.error('[getCropAnalysis]', error);
    return res.status(500).json({ success: false, message: 'Error fetching analysis' });
  }
};

module.exports = {
  analyzeCropDisease,
  updateCropAnalysis,
  deleteCropAnalysis,
  getCropHistory,
  getCropAnalysis
};