const mongoose = require('mongoose');

const cropAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  imageKitId: {
    type: String
  },
  cropType: {
    type: String,
    required: true
  },
  detectedDisease: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100
  },
  recommendation: {
    treatment: String,
    prevention: String,
    organicMethods: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
cropAnalysisSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('CropAnalysis', cropAnalysisSchema);