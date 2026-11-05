const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getAdminOverview,
  getAdminUsers,
  sendAdminMessage
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/overview', getAdminOverview);
router.get('/users', getAdminUsers);
router.post('/messages', sendAdminMessage);

module.exports = router;
