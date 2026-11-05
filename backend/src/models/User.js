const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },

  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },

  phone: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },

  location: {
    type: String,
    required: [true, 'Please provide location'],
    enum: ['Kakuma', 'Lodwar', 'Turkana', 'Other'],
    set: v => v.trim()
  },

  farmSize: {
    type: Number,
    min: [0.1, 'Farm size must be at least 0.1 acres']
  },

  primaryCrops: [{
    type: String,
    lowercase: true,
    trim: true,
    enum: [
      'maize',
      'sorghum',
      'beans',
      'vegetables',
      'cassava',
      'millet',
      'other'
    ]
  }],

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },

  language: {
    type: String,
    default: 'en',
    enum: ['en', 'sw']
  },

  role: {
    type: String,
    default: 'farmer',
    enum: ['farmer', 'admin']
  },

  subscription: {
    plan: {
      type: String,
      default: 'none',
      enum: ['none', 'basic', 'standard', 'premium']
    },
    status: {
      type: String,
      default: 'inactive',
      enum: ['inactive', 'active', 'expired']
    },
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'KES'
    },
    startedAt: Date,
    expiresAt: Date,
    paymentPhone: {
      type: String,
      trim: true
    },
    reference: {
      type: String,
      trim: true
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});


/*
 Normalize crops before validation
*/
userSchema.pre('validate', function () {

  if (this.primaryCrops && Array.isArray(this.primaryCrops)) {
    this.primaryCrops = this.primaryCrops.map(crop =>
      crop.toLowerCase().trim()
    );
  }

});


/*
 Encrypt password before saving
*/
userSchema.pre('save', async function () {

  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

});


/*
 Compare entered password with stored hash
*/
userSchema.methods.matchPassword = async function (enteredPassword) {

  return await bcrypt.compare(enteredPassword, this.password);

};


/*
 Prevent OverwriteModelError
*/
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
