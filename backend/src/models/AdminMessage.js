const mongoose = require('mongoose');

const adminMessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetType: {
    type: String,
    enum: ['all', 'user'],
    required: true
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    enum: ['general', 'soil', 'crop', 'weather', 'drought', 'rain'],
    default: 'general'
  }
}, {
  timestamps: true
});

adminMessageSchema.index({ targetType: 1, recipientId: 1, createdAt: -1 });

module.exports = mongoose.model('AdminMessage', adminMessageSchema);
