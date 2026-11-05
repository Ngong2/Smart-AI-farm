import React, { useState } from "react";
import { FaSeedling, FaLeaf, FaFlask, FaCamera, FaSpinner, FaRedo, FaTint, FaLayerGroup } from "react-icons/fa";
import { GiChemicalDrop, GiWheat } from "react-icons/gi";
import { soilAPI } from "../../services/api";
import toast from "react-hot-toast";

const SoilAdvisory = () => {
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [soilImage, setSoilImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    soilType: "",
    soilColor: "",
    previousCrop: "",
  });

  const [result, setResult] = useState(null);
  const [aiDetection, setAiDetection] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSoilImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setSoilImage(null);
      setImagePreview(null);
    }
  };

  const analyzeImage = async () => {
    if (!soilImage) return toast.error("Please upload a soil image");

    try {
      setImageLoading(true);
      const res = await soilAPI.analyzeImage(soilImage);
      if (res.success) {
        setAiDetection(res.data);
        setFormData((prev) => ({
          ...prev,
          soilType: res.data.soilType || prev.soilType,
          soilColor: res.data.soilColor || prev.soilColor,
        }));
        toast.success("Soil detected successfully");
      }
    } catch (err) {
      console.error("AI Analysis Error:", err?.response || err);
      toast.error(err?.response?.data?.message || "AI soil analysis failed");
    } finally {
      setImageLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.soilType) return toast.error("Soil type is required");

    try {
      setLoading(true);
      const res = await soilAPI.getAdvice(formData);
      if (res.success) {
        setResult(res.data);
        toast.success("Soil advice generated");
      }
    } catch (err) {
      console.error("Soil Advice Error:", err?.response || err);
      toast.error(err?.response?.data?.message || "Failed generating advice");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ soilType: "", soilColor: "", previousCrop: "" });
    setResult(null);
    setAiDetection(null);
    setSoilImage(null);
    setImagePreview(null);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .sa-root {
          font-family: 'DM Sans', sans-serif;
          background: #f5f2ee;
          min-height: 100vh;
          padding: 2.5rem 1.25rem 4rem;
        }
        .sa-header { text-align: center; margin-bottom: 2.5rem; }
        .sa-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2rem, 4vw, 2.75rem);
          color: #1a160f;
          letter-spacing: -0.025em;
          margin: 0 0 0.4rem;
        }
        .sa-subtitle {
          color: #8a7e72;
          font-size: 0.9rem;
          font-weight: 300;
          margin: 0;
        }

        .sa-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          max-width: 1080px;
          margin: 0 auto;
        }
        @media (min-width: 1024px) {
          .sa-grid { grid-template-columns: 1fr 1fr; }
        }

        .sa-card {
          background: #fff;
          border-radius: 20px;
          padding: 2rem 1.75rem;
          border: 1px solid #ede7de;
          box-shadow: 0 4px 24px rgba(50,30,5,0.07);
        }

        .sa-card-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.2rem;
          color: #1a160f;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 0 1.5rem;
        }
        .sa-card-title svg { color: #5a8030; font-size: 1rem; }

        .sa-badge {
          margin-left: auto;
          background: #1e3a0e;
          color: #b8e080;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          font-family: 'DM Sans', sans-serif;
        }

        /* Upload */
        .sa-upload-zone {
          position: relative;
          border: 2px dashed #d0c8be;
          border-radius: 14px;
          background: #faf8f5;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          margin-bottom: 0.85rem;
        }
        .sa-upload-zone:hover { border-color: #5a8030; background: #f3f8eb; }
        .sa-upload-zone input[type="file"] {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
          height: 100%;
          z-index: 2;
        }
        .sa-upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          padding: 2rem 1rem;
          color: #a09890;
          pointer-events: none;
        }
        .sa-upload-placeholder svg { font-size: 1.75rem; color: #5a8030; opacity: 0.7; }
        .sa-upload-placeholder strong { font-size: 0.875rem; color: #6a6058; font-weight: 500; }
        .sa-upload-placeholder small { font-size: 0.75rem; }
        .sa-preview-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }

        /* Buttons */
        .sa-btn-outline {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.72rem 1rem;
          border-radius: 10px;
          border: 1.5px solid #5a8030;
          background: transparent;
          color: #3a5a18;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .sa-btn-outline:hover:not(:disabled) { background: #5a8030; color: #fff; }
        .sa-btn-outline:disabled { opacity: 0.4; cursor: not-allowed; }

        .sa-btn-primary {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.82rem 1rem;
          border-radius: 10px;
          border: none;
          background: #243e10;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          letter-spacing: 0.01em;
        }
        .sa-btn-primary:hover:not(:disabled) { background: #335818; }
        .sa-btn-primary:active:not(:disabled) { transform: scale(0.985); }
        .sa-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

        .sa-btn-ghost {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          padding: 0.7rem 1rem;
          border-radius: 10px;
          border: 1px solid #ddd5c8;
          background: #faf8f5;
          color: #6a6058;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .sa-btn-ghost:hover { border-color: #b0a898; background: #f0ede8; }

        /* AI detection box */
        .sa-ai-box {
          background: linear-gradient(135deg, #edf5e0 0%, #f6faf0 100%);
          border: 1px solid #bdd89a;
          border-radius: 14px;
          padding: 1.1rem 1.25rem;
          margin-top: 1.1rem;
        }
        .sa-ai-box-title {
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #3a6010;
          margin-bottom: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .sa-ai-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.6rem 1rem;
        }
        .sa-ai-field label {
          display: block;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: #7aaa40;
          margin-bottom: 0.15rem;
        }
        .sa-ai-field p {
          font-size: 0.875rem;
          color: #2a4a10;
          font-weight: 500;
          margin: 0;
        }

        /* Divider */
        .sa-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #ddd5c8, transparent);
          margin: 1.4rem 0;
        }

        /* Inputs */
        .sa-field-group { display: flex; flex-direction: column; gap: 0.75rem; }
        .sa-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 9px;
          border: 1.5px solid #ddd5c8;
          background: #faf8f5;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          color: #1a160f;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .sa-input:focus { border-color: #5a8030; box-shadow: 0 0 0 3px rgba(90,128,48,0.12); }
        .sa-input::placeholder { color: #b8b0a8; }

        /* Results */
        .sa-results { display: flex; flex-direction: column; gap: 0.8rem; }

        .sa-result-block {
          border-radius: 12px;
          padding: 0.9rem 1.1rem;
          border: 1px solid;
        }
        .sa-result-block-title {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.55rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .sa-result-item {
          font-size: 0.85rem;
          color: #2a2018;
          padding: 0.25rem 0;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          padding-left: 0.9rem;
          position: relative;
        }
        .sa-result-item::before {
          content: "–";
          position: absolute;
          left: 0;
          color: currentColor;
          opacity: 0.45;
        }
        .sa-result-item:last-child { border-bottom: none; }

        .block-nutrient  { background: #fafaf8; border-color: #e5ddd2; }
        .block-nutrient .sa-result-block-title { color: #5a5248; }
        .block-fertilizer { background: #f1f8e8; border-color: #c8e0a0; }
        .block-fertilizer .sa-result-block-title { color: #3a6018; }
        .block-compost   { background: #fdf8ec; border-color: #e5d8a8; }
        .block-compost .sa-result-block-title { color: #7a5810; }
        .block-rotation  { background: #edf4fc; border-color: #b5d0ee; }
        .block-rotation .sa-result-block-title { color: #1a4a7a; }
        .block-water     { background: #f0f0fb; border-color: #c5c5ee; }
        .block-water .sa-result-block-title { color: #38388a; }
        .block-steps     { background: #fdf0fb; border-color: #e5b8e5; }
        .block-steps .sa-result-block-title { color: #6a186a; }

        .sa-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 4rem 2rem;
          color: #c0b8b0;
          text-align: center;
        }
        .sa-empty-icon { font-size: 2.8rem; opacity: 0.25; }
        .sa-empty p { font-size: 0.875rem; line-height: 1.65; max-width: 210px; margin: 0; }

        .sa-spin { animation: sa-rotate 0.9s linear infinite; }
        @keyframes sa-rotate { to { transform: rotate(360deg); } }
      `}</style>

      <div className="sa-root">
        <div className="sa-header">
          <h1 className="sa-title">Soil Health Advisory</h1>
          <p className="sa-subtitle">AI-powered soil diagnostics and crop improvement guidance</p>
        </div>

        <div className="sa-grid">

          {/* ── LEFT: Input ── */}
          <div className="sa-card">
            <h2 className="sa-card-title">
              <FaSeedling /> Soil Analysis Input
              <span className="sa-badge">✦ AI</span>
            </h2>

            <div className="sa-upload-zone">
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview ? (
                <img src={imagePreview} alt="Soil preview" className="sa-preview-img" />
              ) : (
                <div className="sa-upload-placeholder">
                  <FaCamera />
                  <strong>Click or drag to upload soil image</strong>
                  <small>JPG, PNG, WEBP supported</small>
                </div>
              )}
            </div>

            <button
              onClick={analyzeImage}
              disabled={imageLoading || !soilImage}
              className="sa-btn-outline"
            >
              {imageLoading
                ? <><FaSpinner className="sa-spin" /> Analyzing image…</>
                : <><FaCamera /> Analyze with AI</>
              }
            </button>

            {aiDetection && (
              <div className="sa-ai-box">
                <div className="sa-ai-box-title"><FaLeaf /> Detected Soil Profile</div>
                <div className="sa-ai-grid">
                  <div className="sa-ai-field">
                    <label>Soil Type</label>
                    <p>{aiDetection.soilType}</p>
                  </div>
                  <div className="sa-ai-field">
                    <label>Color</label>
                    <p>{aiDetection.soilColor}</p>
                  </div>
                  <div className="sa-ai-field">
                    <label>Fertility</label>
                    <p>{aiDetection.fertility}</p>
                  </div>
                  <div className="sa-ai-field">
                    <label>Organic Matter</label>
                    <p>{aiDetection.organicMatter}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="sa-divider" />

            <form onSubmit={handleSubmit}>
              <div className="sa-field-group">
                <input
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleChange}
                  placeholder="Soil Type (e.g. Clay, Loam, Sandy)"
                  className="sa-input"
                  required
                />
                <input
                  name="soilColor"
                  value={formData.soilColor}
                  onChange={handleChange}
                  placeholder="Soil Color (e.g. Dark brown, Red)"
                  className="sa-input"
                />
                <input
                  name="previousCrop"
                  value={formData.previousCrop}
                  onChange={handleChange}
                  placeholder="Previous Crop (e.g. Maize, Wheat)"
                  className="sa-input"
                />
                <button
                  type="submit"
                  disabled={loading || !formData.soilType}
                  className="sa-btn-primary"
                >
                  {loading
                    ? <><FaSpinner className="sa-spin" /> Generating advice…</>
                    : <><FaFlask /> Get Soil Advice</>
                  }
                </button>
              </div>
            </form>
          </div>

          {/* ── RIGHT: Results ── */}
          <div className="sa-card">
            <h2 className="sa-card-title">
              <FaLeaf /> Soil Recommendations
            </h2>

            {result ? (
              <div className="sa-results">

                <div className="sa-result-block block-nutrient">
                  <div className="sa-result-block-title">
                    <GiChemicalDrop /> Nutrient Deficiency
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "#3a3328", margin: 0 }}>
                    {result.nutrientDeficiency}
                  </p>
                </div>

                <div className="sa-result-block block-fertilizer">
                  <div className="sa-result-block-title"><FaFlask /> Fertilizers</div>
                  {result.fertilizers?.map((f, i) => (
                    <div className="sa-result-item" key={i}>{f}</div>
                  ))}
                </div>

                <div className="sa-result-block block-compost">
                  <div className="sa-result-block-title"><FaLayerGroup /> Compost Methods</div>
                  {result.compostMethods?.map((c, i) => (
                    <div className="sa-result-item" key={i}>{c}</div>
                  ))}
                </div>

                <div className="sa-result-block block-rotation">
                  <div className="sa-result-block-title"><GiWheat /> Crop Rotation</div>
                  {result.cropRotation?.map((r, i) => (
                    <div className="sa-result-item" key={i}>{r}</div>
                  ))}
                </div>

                <div className="sa-result-block block-water">
                  <div className="sa-result-block-title"><FaTint /> Water Retention</div>
                  {result.waterRetention?.map((w, i) => (
                    <div className="sa-result-item" key={i}>{w}</div>
                  ))}
                </div>

                <div className="sa-result-block block-steps">
                  <div className="sa-result-block-title"><FaSeedling /> Improvement Steps</div>
                  {result.improvementSteps?.map((s, i) => (
                    <div className="sa-result-item" key={i}>{s}</div>
                  ))}
                </div>

                <button onClick={handleReset} className="sa-btn-ghost">
                  <FaRedo style={{ fontSize: "0.75rem" }} /> New Analysis
                </button>
              </div>
            ) : (
              <div className="sa-empty">
                <div className="sa-empty-icon"><FaLeaf /></div>
                <p>Upload a soil image and run analysis to see your recommendations here</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default SoilAdvisory;