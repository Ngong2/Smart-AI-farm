const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

const isValidAdminEmail = (email) =>
  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);

const getAdminCredentials = () => {
  const email = (process.env.ADMIN_EMAIL || '').trim();

  return {
    username: (process.env.ADMIN_USERNAME || 'admin').trim(),
    password: process.env.ADMIN_PASSWORD || 'admin123456',
    email: isValidAdminEmail(email) ? email : 'admin@smartfarm.co.ke'
  };
};

const formatSubscription = (subscription = {}) => ({
  plan: subscription.plan || 'none',
  status: subscription.status || 'inactive',
  amount: subscription.amount || 0,
  currency: subscription.currency || 'KES',
  startedAt: subscription.startedAt || null,
  expiresAt: subscription.expiresAt || null,
  paymentPhone: subscription.paymentPhone || '',
  reference: subscription.reference || ''
});

/*
 REGISTER USER
*/
const registerUser = async (req, res) => {
  try {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    let { name, email, phone, location, farmSize, primaryCrops, password } = req.body;

    if (farmSize) {
      farmSize = parseFloat(farmSize);
    }

    if (primaryCrops) {
      if (typeof primaryCrops === "string") {
        primaryCrops = primaryCrops.split(",").map(c => c.trim());
      }

      if (!Array.isArray(primaryCrops)) {
        return res.status(400).json({
          success: false,
          message: "Primary crops must be an array"
        });
      }
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email"
      });
    }

    if (phone) {
      const phoneExists = await User.findOne({ phone });

      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: "Phone number already in use"
        });
      }
    }

    const user = await User.create({
      name,
      email,
      phone,
      location,
      farmSize,
      primaryCrops,
      password
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        farmSize: user.farmSize,
        primaryCrops: user.primaryCrops,
        role: user.role,
        subscription: formatSubscription(user.subscription),
        token: generateToken(user._id)
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error during registration"
    });
  }
};

/*
 LOGIN USER
*/
const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        farmSize: user.farmSize,
        primaryCrops: user.primaryCrops,
        language: user.language,
        role: user.role,
        subscription: formatSubscription(user.subscription),
        token: generateToken(user._id)
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error during login"
    });

  }
};

/*
 ADMIN LOGIN
*/
const loginAdmin = async (req, res) => {
  try {

    const { username, password } = req.body;
    const adminCredentials = getAdminCredentials();

    if (
      username !== adminCredentials.username ||
      password !== adminCredentials.password
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin username or password"
      });
    }

    let admin = await User.findOne({
      email: adminCredentials.email,
      role: 'admin'
    }).select("+password");

    if (!admin) {
      admin = await User.create({
        name: 'SMART FARM Admin',
        email: adminCredentials.email,
        location: 'Turkana',
        farmSize: 1,
        primaryCrops: ['maize'],
        password: adminCredentials.password,
        role: 'admin'
      });
    } else if (!(await admin.matchPassword(adminCredentials.password))) {
      admin.password = adminCredentials.password;
      await admin.save();
    }

    res.json({
      success: true,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        location: admin.location,
        farmSize: admin.farmSize,
        primaryCrops: admin.primaryCrops,
        language: admin.language,
        role: admin.role,
        subscription: formatSubscription(admin.subscription),
        token: generateToken(admin._id)
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error during admin login"
    });

  }
};

/*
 GET PROFILE
*/
const getUserProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};

/*
 UPDATE PROFILE
*/
const updateUserProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.location = req.body.location?.trim() || user.location;

    if (req.body.farmSize) {
      user.farmSize = parseFloat(req.body.farmSize);
    }

    if (req.body.primaryCrops) {
      let crops = req.body.primaryCrops;

      if (typeof crops === "string") {
        crops = crops.split(",").map(c => c.trim());
      }

      user.primaryCrops = crops;
    }

    user.language = req.body.language || user.language;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        location: updatedUser.location,
        farmSize: updatedUser.farmSize,
        primaryCrops: updatedUser.primaryCrops,
        language: updatedUser.language,
        role: updatedUser.role,
        subscription: formatSubscription(updatedUser.subscription),
        token: generateToken(updatedUser._id)
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};

module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
  getUserProfile,
  updateUserProfile
};
