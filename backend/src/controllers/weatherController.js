const { getGeminiTextModel } = require("../config/gemini");  
const { getWeatherData, getForecast } = require("../utils/weatherApi");
const mongoose = require("mongoose");
const WeatherAdvice = require("../models/WeatherAdvice");

const SUPPORTED_CROPS = [
  "maize", "sorghum", "beans", "cowpeas",
  "millet", "cassava", "vegetables"
];

const WEATHER_THRESHOLDS = {
  HIGH_TEMP: 35,
  LOW_HUMIDITY: 20,
  HEAVY_RAIN: 10,
  STRONG_WIND: 10
};

/* GET WEATHER ADVICE */
const getWeatherAdvice = async (req, res) => {
  try {
    const lat = req.user?.lat || 3.7348;
    const lng = req.user?.lng || 34.8666;
    const userId = req.user?._id;

    const currentWeather = await getWeatherData(lat, lng);
    const forecast = await getForecast(lat, lng);

    const normalizedWeather = {
      temperature: currentWeather?.temperature || 30,
      humidity: currentWeather?.humidity || 30,
      description: currentWeather?.description || "Clear",
      windSpeed: currentWeather?.windSpeed || 3
    };

    const safeForecast = forecast.length
      ? forecast
      : [
          { date: new Date().toISOString(), temperature: 30, rainfall: 0, humidity: 30, windSpeed: 3 },
          { date: new Date(Date.now() + 3600*1000).toISOString(), temperature: 32, rainfall: 0, humidity: 28, windSpeed: 3 }
        ];

    const model = getGeminiTextModel();

    const prompt = `
You are an agriculture expert in Turkana Kenya.

Weather:
Temperature: ${normalizedWeather.temperature}
Humidity: ${normalizedWeather.humidity}
Wind: ${normalizedWeather.windSpeed}

Forecast:
${safeForecast.map(d => `${d.date} ${d.temperature}C`).join("\n")}

Common crops:
${SUPPORTED_CROPS.join(",")}

Return JSON:

{
 "plantingAdvice":"",
 "irrigationNeeds":"",
 "suitableCrops":[],
 "weatherRisks":[],
 "practicalTips":[]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let advice;
    try {
      const jsonMatch = text.match(/\{.*\}/s);
      advice = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
    } catch {
      advice = {
        plantingAdvice: "Plant early morning",
        irrigationNeeds: "Use drip irrigation",
        suitableCrops: ["Sorghum","Millet"],
        weatherRisks: ["Heat stress"],
        practicalTips: ["Mulching","Use drought crops"]
      };
    }

    // ✅ Ensure userId exists for Mongo
    let weatherRecord;
    try {
      weatherRecord = await WeatherAdvice.create({
        userId: userId || new mongoose.Types.ObjectId(),
        location: "Turkana",
        currentWeather: normalizedWeather,
        forecast: safeForecast,
        advice
      });
    } catch (err) {
      console.error("Failed to save WeatherAdvice:", err);
    }

    res.json({
      success: true,
      data: weatherRecord || { currentWeather: normalizedWeather, forecast: safeForecast, advice }
    });

  } catch (error) {
    console.error("Weather advice error:", error);
    res.status(500).json({ success:false, message:"Error generating weather advice" });
  }
};

/* GET WEATHER ALERTS */
const getWeatherAlerts = async (req, res) => {
  try {
    const lat = req.user?.lat || 3.7348;
    const lng = req.user?.lng || 34.8666;
    const userId = req.user?._id || new mongoose.Types.ObjectId();

    const forecast = await getForecast(lat, lng);
    const safeForecast = forecast.length
      ? forecast
      : [
          { date: new Date().toISOString(), temperature: 35, humidity: 25, rainfall: 0, windSpeed: 4 },
          { date: new Date(Date.now() + 3600 * 1000).toISOString(), temperature: 37, humidity: 20, rainfall: 0, windSpeed: 6 }
        ];

    const model = getGeminiTextModel();
    const prompt = `
You are a weather risk expert for farmers in Turkana Kenya.

Forecast:
${safeForecast
  .map(
    (day) => `
Date:${day.date}
Temp:${day.temperature}
Humidity:${day.humidity}
Rain:${day.rainfall}
Wind:${day.windSpeed}`
  )
  .join("\n")}

Return JSON:

{
 "alerts":[
  {
   "type":"Heatwave",
   "date":"2026-01-01",
   "severity":"high",
   "message":"Extreme heat expected"
  }
 ]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let alerts = [];
    try {
      const jsonMatch = text.match(/\{.*\}/s);
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
      alerts = (parsed.alerts || []).map((a) => ({
        type: a.type || "General",
        date: a.date || new Date().toISOString(),
        severity: ["low", "medium", "high"].includes(a.severity) ? a.severity : "low",
        message: a.message || "No details provided"
      }));
    } catch {
      // fallback if JSON parsing fails
      safeForecast.forEach((day) => {
        if (day.temperature > WEATHER_THRESHOLDS.HIGH_TEMP) {
          alerts.push({
            type: "Heatwave",
            date: day.date,
            severity: "high",
            message: "Extreme heat expected. Irrigate early."
          });
        }
        if (day.rainfall > WEATHER_THRESHOLDS.HEAVY_RAIN) {
          alerts.push({
            type: "Heavy Rain",
            date: day.date,
            severity: "medium",
            message: "Heavy rain expected. Ensure drainage."
          });
        }
      });
    }

    // Ensure a WeatherAdvice record exists
    let record = await WeatherAdvice.findOne({ userId }).sort({ createdAt: -1 });
    if (!record) {
      // Create a new record if none exists
      record = await WeatherAdvice.create({
        userId,
        location: "Turkana",
        currentWeather: { temperature: 30, humidity: 30, description: "Clear", windSpeed: 3 },
        forecast: safeForecast,
        advice: { alerts }
      });
    } else {
      // Update alerts properly
      record.set("advice.alerts", alerts); // <- use set() to ensure Mongoose tracks changes
      await record.save();
    }

    res.json({ success: true, data: { location: "Turkana", totalAlerts: alerts.length, alerts } });
  } catch (error) {
    console.error("Weather alerts error:", error);
    res.status(500).json({ success: false, message: "Error generating alerts" });
  }
};

/* UPDATE WEATHER ADVICE */
const updateWeatherAdvice = async (req,res)=>{
  try{
    const record = await WeatherAdvice.findById(req.params.id);
    if(!record) return res.status(404).json({ success:false, message:"Weather advice not found" });

    if(req.body.advice) record.advice = { ...record.advice, ...req.body.advice };
    if(req.body.currentWeather) record.currentWeather = req.body.currentWeather;
    if(req.body.forecast) record.forecast = req.body.forecast;

    const updated = await record.save();
    res.json({ success:true, data:updated });

  }catch(error){
    res.status(500).json({ success:false, message:"Error updating advice" });
  }
};

/* DELETE WEATHER ADVICE */
const deleteWeatherAdvice = async (req,res)=>{
  try{
    const record = await WeatherAdvice.findById(req.params.id);
    if(!record) return res.status(404).json({ success:false, message:"Weather advice not found" });

    await record.deleteOne();
    res.json({ success:true, message:"Weather advice deleted" });

  }catch(error){
    res.status(500).json({ success:false, message:"Error deleting advice" });
  }
};

module.exports = {
  getWeatherAdvice,
  getWeatherAlerts,
  updateWeatherAdvice,
  deleteWeatherAdvice
};