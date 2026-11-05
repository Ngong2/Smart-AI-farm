const express = require('express');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  analyzeSoilImage,
  getSoilAdvice,
  getSoilHistory,
  getSoilReport,
  updateSoilReport,
  deleteSoilReport
} = require('../controllers/soilController');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Soil analysis routes
router.post('/analyze-image', upload.single('soilImage'), analyzeSoilImage);
router.post('/advice', getSoilAdvice);

// History
router.get('/history', getSoilHistory);

// Single report
router.get('/:id', getSoilReport);

// Update report
router.put('/:id', updateSoilReport);

// Delete report
router.delete('/:id', deleteSoilReport);

module.exports = router;