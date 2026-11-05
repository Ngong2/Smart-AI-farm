const SoilReport = require("../models/SoilReport");
const { getGeminiModel, getGeminiTextModel } = require("../config/gemini");
const ImageKit = require("imagekit");

// ─── ImageKit Init ────────────────────────────────────────────────────────────
const imagekit = new ImageKit({
  publicKey:   process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey:  process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// ─── Constants ────────────────────────────────────────────────────────────────
const SUPPORTED_SOIL_TYPES = [
  "sandy", "clay", "loam", "silt",
  "black", "red", "volcanic", "laterite",
];

const SOIL_NUTRIENT_PROFILE = {
  sandy:    "Low nitrogen and organic matter. Drains quickly, needs frequent amendment.",
  clay:     "Low phosphorus availability; holds nutrients but poor drainage and aeration.",
  loam:     "Balanced macro- and micro-nutrients. Ideal structure for most crops.",
  silt:     "Moderate nutrients; prone to surface crusting and erosion.",
  black:    "High organic matter and moisture retention; may need drainage management.",
  red:      "Low nitrogen and organic matter; high iron/aluminium oxides.",
  volcanic: "Rich in minerals (potassium, phosphorus); excellent long-term fertility.",
  laterite: "Low fertility; heavily leached; needs heavy organic amendment.",
};

// Helper – normalise a soil type returned by AI
const normaliseSoilType = (raw = "") => {
  const lower = raw.toLowerCase().trim();
  return SUPPORTED_SOIL_TYPES.includes(lower) ? lower : "loam";
};

// Helper – extract the first JSON object from an AI text response
const extractJSON = (text) => {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? JSON.parse(match[0]) : null;
};

// ─── AI IMAGE ANALYSIS ────────────────────────────────────────────────────────
/**
 * POST /soil/analyze-image
 * Accepts a multipart image upload, runs vision AI, persists a SoilReport.
 */
exports.analyzeSoilImage = async (req, res) => {
  try {
    if (!req.user?._id)
      return res.status(401).json({ success: false, message: "Unauthorized." });
    if (!req.file)
      return res.status(400).json({ success: false, message: "Please upload a soil image." });

    // ── 1. Upload image to ImageKit (non-blocking on failure) ──
    let imageUrl = null;
    try {
      const upload = await imagekit.upload({
        file:     req.file.buffer,
        fileName: `soil-${Date.now()}.jpg`,
        folder:   "/soil-images",
      });
      imageUrl = upload.url;
    } catch (uploadErr) {
      console.warn("[ImageKit] Upload failed, continuing without URL:", uploadErr.message);
    }

    // ── 2. Call vision model ──
    const model = getGeminiModel();
    if (!model)
      return res.status(503).json({ success: false, message: "Vision AI model unavailable." });

    // ★ PROFESSIONAL PROMPT – structured, unambiguous, output-typed
    const VISION_PROMPT = `
You are a senior agricultural soil scientist with 20+ years of field experience.

TASK
Carefully examine the soil photograph provided and return a concise JSON analysis.

OUTPUT FORMAT (strict JSON, no markdown, no extra text)
{
  "soilType": "<one of: sandy | clay | loam | silt | black | red | volcanic | laterite>",
  "soilColor": "<descriptive Munsell-style color, e.g. 'dark reddish-brown'>",
  "fertility": "<one of: low | moderate | high>",
  "organicMatter": "<one of: low | medium | high>",
  "confidence": "<one of: low | medium | high – your confidence in this classification>"
}

CLASSIFICATION GUIDELINES
- Base soilType on visible texture, structure, and color.
- Base fertility on color depth, visible aggregates, and organic residues.
- If the image is unclear or not a soil image, return soilType "loam" and confidence "low".
- Do NOT include explanations, markdown blocks, or any text outside the JSON object.
`.trim();

    let aiRaw;
    try {
      const result = await model.generateContent([
        VISION_PROMPT,
        { inlineData: { mimeType: req.file.mimetype, data: req.file.buffer.toString("base64") } },
      ]);
      aiRaw = result.response.text();
    } catch (aiErr) {
      console.error("[Gemini Vision] Error:", aiErr.message);
      return res.status(502).json({ success: false, message: "AI vision model failed. Please retry." });
    }

    // ── 3. Parse AI response ──
    const defaults = { soilType: "loam", soilColor: "brown", fertility: "moderate", organicMatter: "medium" };
    let soilData = defaults;
    try {
      const parsed = extractJSON(aiRaw);
      if (parsed) soilData = { ...defaults, ...parsed };
    } catch {
      console.warn("[Gemini Vision] JSON parse failed – using defaults.");
    }

    const soilType = normaliseSoilType(soilData.soilType);

    // ── 4. Persist report ──
    const report = await SoilReport.create({
      userId:     req.user._id,
      soilType,
      soilColor:  soilData.soilColor || "brown",
      imageUrl:   imageUrl ?? `local-${Date.now()}`,
      analysis: {
        fertility:         soilData.fertility     || "moderate",
        organicMatter:     soilData.organicMatter || "medium",
        nutrientDeficiency: SOIL_NUTRIENT_PROFILE[soilType],
        phLevel:           "Neutral (estimated – lab test recommended)",
      },
    });

    return res.status(201).json({
      success: true,
      data: {
        reportId:      report._id,
        soilType:      report.soilType,
        soilColor:     report.soilColor,
        fertility:     report.analysis.fertility,
        organicMatter: report.analysis.organicMatter,
        imageUrl:      imageUrl,
      },
    });

  } catch (error) {
    console.error("[analyzeSoilImage] Unexpected error:", error);
    return res.status(500).json({ success: false, message: "Soil image analysis failed. Please try again." });
  }
};

// ─── SOIL ADVICE ──────────────────────────────────────────────────────────────
/**
 * POST /soil/advice
 * Accepts soilType, soilColor, previousCrop and returns AI improvement plan.
 */
exports.getSoilAdvice = async (req, res) => {
  try {
    if (!req.user?._id)
      return res.status(401).json({ success: false, message: "Unauthorized." });

    const { soilType, soilColor, previousCrop } = req.body;
    if (!soilType)
      return res.status(400).json({ success: false, message: "soilType is required." });

    const validSoilType = normaliseSoilType(soilType);

    const model = getGeminiTextModel();
    if (!model)
      return res.status(503).json({ success: false, message: "Text AI model unavailable." });

    // ★ PROFESSIONAL PROMPT – role-primed, context-rich, typed output
    const ADVICE_PROMPT = `
You are a certified agronomist and soil health consultant advising smallholder farmers.

CONTEXT
- Soil type:     ${validSoilType}
- Soil color:    ${soilColor  || "not specified"}
- Previous crop: ${previousCrop || "not specified"}
- Known nutrient profile: ${SOIL_NUTRIENT_PROFILE[validSoilType]}

TASK
Generate a practical, actionable soil improvement plan for the next growing season.
Recommendations must be affordable, locally sourceable, and suitable for smallholder scale.

OUTPUT FORMAT (strict JSON, no markdown, no extra text)
{
  "nutrientDeficiency": "<primary deficiencies and their impact on yield>",
  "phLevel": "<estimated range, e.g. '5.5–6.5 (slightly acidic)'>",
  "organicMatter": "<current estimated level and target>",
  "fertilizers": ["<specific product or organic source>", "..."],
  "compostMethods": ["<composting technique suited to this soil>", "..."],
  "cropRotation": ["<rotation sequence with rationale>", "..."],
  "waterRetention": ["<technique to improve moisture retention>", "..."],
  "improvementSteps": ["<numbered, sequential action steps for the farmer>", "..."]
}

RULES
- Each array must contain 2–4 items.
- Use plain language a farmer with primary education can act on.
- Do NOT include explanations, markdown blocks, or any text outside the JSON object.
`.trim();

    let aiRaw;
    try {
      const result = await model.generateContent(ADVICE_PROMPT);
      aiRaw = result.response.text();
    } catch (aiErr) {
      console.error("[Gemini Text] Error:", aiErr.message);
      return res.status(502).json({ success: false, message: "AI text model failed. Please retry." });
    }

    // ── Parse AI response ──
    const defaults = {
      nutrientDeficiency: SOIL_NUTRIENT_PROFILE[validSoilType],
      phLevel:            "Neutral (6.5–7.0, estimated)",
      organicMatter:      "Low – target > 3 % within 2 seasons",
      fertilizers:        ["Organic farmyard manure", "Compost tea"],
      compostMethods:     ["Pit composting", "Vermicomposting"],
      cropRotation:       ["Legumes → cereals → root vegetables"],
      waterRetention:     ["Mulching with crop residue", "Zai pits / micro-basins"],
      improvementSteps:   ["Apply 5 t/ha manure before planting", "Sow cowpea as green manure during off-season"],
    };

    let advice = defaults;
    try {
      const parsed = extractJSON(aiRaw);
      if (parsed) advice = { ...defaults, ...parsed };
    } catch {
      console.warn("[Gemini Text] JSON parse failed – using defaults.");
    }

    // ── Persist report ──
    const report = await SoilReport.create({
      userId:       req.user._id,
      soilType:     validSoilType,
      soilColor:    soilColor    || "not specified",
      previousCrop: previousCrop || "not specified",
      analysis: {
        nutrientDeficiency: advice.nutrientDeficiency,
        phLevel:            advice.phLevel,
        organicMatter:      advice.organicMatter,
      },
      suggestions: {
        fertilizers:      advice.fertilizers,
        compostMethods:   advice.compostMethods,
        cropRotation:     advice.cropRotation,
        waterRetention:   advice.waterRetention,
        improvementSteps: advice.improvementSteps,
      },
    });

    return res.status(201).json({ success: true, data: { reportId: report._id, ...advice } });

  } catch (error) {
    console.error("[getSoilAdvice] Unexpected error:", error);
    return res.status(500).json({ success: false, message: "Failed to generate soil advice. Please try again." });
  }
};

// ─── HISTORY & REPORTS ────────────────────────────────────────────────────────

/** GET /soil/history  – last 20 reports for the authenticated user */
exports.getSoilHistory = async (req, res) => {
  try {
    if (!req.user?._id)
      return res.status(401).json({ success: false, message: "Unauthorized." });

    const reports = await SoilReport
      .find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    console.error("[getSoilHistory] Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch soil history." });
  }
};

/** GET /soil/report/:id  – single report owned by the authenticated user */
exports.getSoilReport = async (req, res) => {
  try {
    if (!req.user?._id)
      return res.status(401).json({ success: false, message: "Unauthorized." });

    const report = await SoilReport.findOne({ _id: req.params.id, userId: req.user._id }).lean();
    if (!report)
      return res.status(404).json({ success: false, message: "Report not found." });

    return res.json({ success: true, data: report });
  } catch (error) {
    console.error("[getSoilReport] Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch report." });
  }
};

/** PATCH /soil/report/:id  – partial update of an owned report */
exports.updateSoilReport = async (req, res) => {
  try {
    if (!req.user?._id)
      return res.status(401).json({ success: false, message: "Unauthorized." });

    // Whitelist updatable fields to prevent mass-assignment
    const ALLOWED = ["soilColor", "previousCrop", "notes"];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([k]) => ALLOWED.includes(k))
    );

    const report = await SoilReport.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!report)
      return res.status(404).json({ success: false, message: "Report not found." });

    return res.json({ success: true, data: report });
  } catch (error) {
    console.error("[updateSoilReport] Error:", error);
    return res.status(500).json({ success: false, message: "Update failed." });
  }
};

/** DELETE /soil/report/:id  – delete an owned report */
exports.deleteSoilReport = async (req, res) => {
  try {
    if (!req.user?._id)
      return res.status(401).json({ success: false, message: "Unauthorized." });

    const report = await SoilReport.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!report)
      return res.status(404).json({ success: false, message: "Report not found." });

    return res.json({ success: true, message: "Report deleted successfully." });
  } catch (error) {
    console.error("[deleteSoilReport] Error:", error);
    return res.status(500).json({ success: false, message: "Delete failed." });
  }
};