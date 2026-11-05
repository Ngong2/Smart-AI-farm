const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const {
  getWeatherAdvice,
  getWeatherAlerts,
  updateWeatherAdvice,
  deleteWeatherAdvice
} = require("../controllers/weatherController");

// -----------------------------
// Weather Advice Endpoints
// -----------------------------

router.use(protect);

// GET latest AI weather advice
router.get("/advice", getWeatherAdvice);

// GET AI-generated weather alerts
router.get("/alerts", getWeatherAlerts);

// UPDATE a specific weather advice record by ID
router.put("/advice/:id", updateWeatherAdvice);

// DELETE a specific weather advice record by ID
router.delete("/advice/:id", deleteWeatherAdvice);

module.exports = router;
