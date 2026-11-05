const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getFarmerOverview,
  getSubscription,
  subscribeFarmer
} = require('../controllers/farmerController');

const router = express.Router();

router.use(protect);

router.get('/overview', getFarmerOverview);
router.get('/subscription', getSubscription);
router.post('/subscription', subscribeFarmer);

module.exports = router;
