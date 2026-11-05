const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
  type: { type: String, required: true },
  date: { type: String, required: true },
  severity: { type: String, enum: ["low", "medium", "high"], required: true },
  message: { type: String, required: true }
}, { _id: false });

const WeatherAdviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  location: { type: String, required: true },
  currentWeather: {
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    description: { type: String, required: true },
    windSpeed: { type: Number, required: true }
  },
  forecast: [
    {
      date: String,
      temperature: Number,
      humidity: Number,
      rainfall: Number,
      windSpeed: Number
    }
  ],
  advice: {
    plantingAdvice: { type: String, default: "" },
    irrigationNeeds: { type: String, default: "" },
    suitableCrops: { type: [String], default: [] },
    weatherRisks: { type: [String], default: [] },
    practicalTips: { type: [String], default: [] },
    alerts: { type: [AlertSchema], default: [] } 
  }
}, { timestamps: true });

module.exports = mongoose.model("WeatherAdvice", WeatherAdviceSchema);