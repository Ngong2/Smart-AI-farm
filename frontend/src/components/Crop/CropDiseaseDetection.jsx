import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  FaCamera,
  FaUpload,
  FaLeaf,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaFlask,
  FaShieldAlt,
  FaRecycle,
} from "react-icons/fa";
import { cropAPI } from "../../services/api";
import toast from "react-hot-toast";

const CropDiseaseDetection = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png"] },
    maxSize: 5242880,
  });

  const handleAnalyze = async () => {
    if (!image) {
      toast.error("Upload image first");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const res = await cropAPI.analyze(formData);

      if (res.success) {
        setResult(res.data);
        toast.success("Analysis complete");
      }
    } catch (error) {
      toast.error("Analysis failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "low":
        return "yellow";
      case "medium":
        return "orange";
      case "high":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">

      <h1 className="text-4xl font-bold text-center mb-10">
        Crop Disease Detection
      </h1>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Upload Section */}

        <div className="card">

          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaCamera className="mr-2 text-green-600" />
            Upload Crop Image
          </h2>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer ${
              isDragActive ? "border-green-500 bg-green-50" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />

            {preview ? (
              <div className="relative">

                <img
                  src={preview}
                  alt="preview"
                  className="max-h-80 mx-auto rounded"
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                >
                  <FaTimesCircle />
                </button>

              </div>
            ) : (
              <>
                <FaUpload className="text-4xl mx-auto mb-3 text-gray-400" />
                <p>Drag image here or click to upload</p>
                <p className="text-sm text-gray-400">JPG / PNG (max 5MB)</p>
              </>
            )}
          </div>

          {preview && (
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="btn-primary w-full mt-6 flex justify-center items-center"
            >
              {loading ? "Analyzing..." : (
                <>
                  <FaFlask className="mr-2" />
                  Analyze Crop
                </>
              )}
            </button>
          )}

        </div>

        {/* Results Section */}

        <div className="card">

          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <FaLeaf className="mr-2 text-green-600" />
            Analysis Results
          </h2>

          <AnimatePresence>

            {result ? (

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >

                {/* Status */}

                <div
                  className={`p-6 rounded-lg ${
                    result.detectedDisease === "Healthy"
                      ? "bg-green-50"
                      : "bg-red-50"
                  }`}
                >

                  <div className="flex justify-between items-center mb-4">

                    <span className="font-semibold">Status</span>

                    {result.detectedDisease === "Healthy" ? (
                      <span className="text-green-700 flex items-center">
                        <FaCheckCircle className="mr-1" />
                        Healthy
                      </span>
                    ) : (
                      <span className="text-red-700 flex items-center">
                        <FaExclamationTriangle className="mr-1" />
                        Disease Detected
                      </span>
                    )}

                  </div>

                  <div className="grid grid-cols-2 gap-4">

                    <div>
                      <p className="text-sm text-gray-500">Crop Type</p>
                      <p className="font-semibold capitalize">
                        {result.cropType}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Disease</p>
                      <p className="font-semibold">
                        {result.detectedDisease}
                      </p>
                    </div>

                  </div>

                </div>

                {/* Severity */}

                {result.severity && (

                  <div>

                    <p className="mb-2 font-medium">Severity</p>

                    <div className="h-3 bg-gray-200 rounded">

                      <div
                        className={`h-3 rounded bg-${getSeverityColor(
                          result.severity
                        )}-500`}
                        style={{
                          width:
                            result.severity === "Low"
                              ? "33%"
                              : result.severity === "Medium"
                              ? "66%"
                              : "100%",
                        }}
                      />

                    </div>

                    <p className="mt-1">{result.severity}</p>

                  </div>

                )}

                {/* Treatment */}

                {result.recommendation?.treatment && (

                  <div className="bg-green-50 p-4 rounded">

                    <h3 className="font-semibold flex items-center mb-2">
                      <FaShieldAlt className="mr-2" />
                      Treatment
                    </h3>

                    <p>{result.recommendation.treatment}</p>

                  </div>

                )}

                {/* Prevention */}

                {result.recommendation?.prevention && (

                  <div className="bg-blue-50 p-4 rounded">

                    <h3 className="font-semibold flex items-center mb-2">
                      <FaRecycle className="mr-2" />
                      Prevention
                    </h3>

                    <p>{result.recommendation.prevention}</p>

                  </div>

                )}

                {/* Timestamp */}

                <p className="text-sm text-gray-400">
                  Analyzed: {new Date(result.createdAt).toLocaleString()}
                </p>

              </motion.div>

            ) : (

              <div className="text-center text-gray-400 py-20">
                Upload image to see analysis
              </div>

            )}

          </AnimatePresence>

        </div>

      </div>

    </div>
  );
};

export default CropDiseaseDetection;
