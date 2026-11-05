const express = require('express');
const { body } = require('express-validator');
const {
  registerUser,
  loginUser,
  loginAdmin,
  getUserProfile,
  updateUserProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation for registration
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('farmSize').notEmpty().withMessage('Farm size is required'),
  body('primaryCrops').notEmpty().withMessage('Primary crops are required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Validation for login
const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Validation for admin login
const adminLoginValidation = [
  body('username').notEmpty().withMessage('Admin username is required'),
  body('password').notEmpty().withMessage('Admin password is required')
];

// Public routes
router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.post('/admin-login', adminLoginValidation, loginAdmin);

// Private routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
