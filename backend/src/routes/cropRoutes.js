const express = require('express');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  analyzeCropDisease,
  getCropHistory,
  getCropAnalysis,
  updateCropAnalysis,
  deleteCropAnalysis
} = require('../controllers/cropController');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Crop analysis routes
router.post('/analyze', upload.single('image'), analyzeCropDisease);
router.get('/history', getCropHistory);
router.get('/:id', getCropAnalysis);
router.put('/:id', updateCropAnalysis);
router.delete('/:id', deleteCropAnalysis);

module.exports = router;