const CropAnalysis = require('../models/CropAnalysis');
const SoilReport = require('../models/SoilReport');
const WeatherAdvice = require('../models/WeatherAdvice');
const AdminMessage = require('../models/AdminMessage');
const User = require('../models/User');

const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic',
    amount: 200,
    currency: 'KES',
    durationDays: 30,
    features: ['Crop disease checks', 'Weather advisory', 'Farmer dashboard']
  },
  {
    id: 'standard',
    name: 'Standard',
    amount: 500,
    currency: 'KES',
    durationDays: 30,
    features: ['Crop disease checks', 'Weather advisory', 'Soil health analysis', 'Farm record tracking']
  },
  {
    id: 'premium',
    name: 'Premium',
    amount: 1000,
    currency: 'KES',
    durationDays: 30,
    features: ['Crop disease checks', 'Weather advisory', 'Soil health analysis', 'Farm record tracking', 'Admin support messages']
  }
];

const getPlanById = (planId) => subscriptionPlans.find((plan) => plan.id === planId);

const sanitizeSubscription = (subscription = {}) => ({
  plan: subscription.plan || 'none',
  status: subscription.status || 'inactive',
  amount: subscription.amount || 0,
  currency: subscription.currency || 'KES',
  startedAt: subscription.startedAt || null,
  expiresAt: subscription.expiresAt || null,
  paymentPhone: subscription.paymentPhone || '',
  reference: subscription.reference || ''
});

const getWeatherSummary = (record) => {
  const forecast = record?.forecast || [];
  const rainfallTotal = forecast.reduce((sum, day) => sum + Number(day.rainfall || 0), 0);
  const maxTemp = forecast.reduce((max, day) => Math.max(max, Number(day.temperature || 0)), record?.currentWeather?.temperature || 0);
  const minHumidity = forecast.reduce((min, day) => Math.min(min, Number(day.humidity || 100)), record?.currentWeather?.humidity || 100);
  const riskText = (record?.advice?.weatherRisks || []).join(' ').toLowerCase();
  const droughtRisk = maxTemp >= 35 || minHumidity <= 25 || riskText.includes('drought') || riskText.includes('heat');

  let rainOutlook = 'Low rain expected';
  if (rainfallTotal >= 30) rainOutlook = 'Strong rain expected';
  else if (rainfallTotal >= 10) rainOutlook = 'Moderate rain expected';

  return {
    currentTemperature: record?.currentWeather?.temperature || null,
    currentHumidity: record?.currentWeather?.humidity || null,
    rainfallTotal,
    maxTemp,
    minHumidity,
    droughtRisk: droughtRisk ? 'high' : 'normal',
    rainOutlook,
    advice: record?.advice || null
  };
};

const getYieldScore = (cropRecords, soilRecords, weatherSummary) => {
  const highCropRisks = cropRecords.filter((record) => record.severity === 'High').length;
  const mediumCropRisks = cropRecords.filter((record) => record.severity === 'Medium').length;
  const lowFertilitySoils = soilRecords.filter((record) => record.analysis?.fertility === 'low').length;
  const droughtPenalty = weatherSummary.droughtRisk === 'high' ? 15 : 0;
  const score = Math.max(0, 100 - highCropRisks * 15 - mediumCropRisks * 8 - lowFertilitySoils * 10 - droughtPenalty);

  let label = 'Strong';
  if (score < 50) label = 'At risk';
  else if (score < 75) label = 'Needs attention';

  return {
    score,
    label,
    highCropRisks,
    mediumCropRisks,
    lowFertilitySoils
  };
};

const getFarmerOverview = async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      cropRecords,
      soilRecords,
      weatherRecords,
      messages
    ] = await Promise.all([
      CropAnalysis.find({ userId }).sort({ createdAt: -1 }).limit(20).lean(),
      SoilReport.find({ userId }).sort({ createdAt: -1 }).limit(20).lean(),
      WeatherAdvice.find({ userId }).sort({ createdAt: -1 }).limit(10).lean(),
      AdminMessage.find({
        $or: [
          { targetType: 'all' },
          { targetType: 'user', recipientId: userId }
        ]
      }).sort({ createdAt: -1 }).limit(10).lean()
    ]);

    const weatherSummary = getWeatherSummary(weatherRecords[0]);
    const yieldOutlook = getYieldScore(cropRecords, soilRecords, weatherSummary);

    res.json({
      success: true,
      data: {
        summary: {
          cropDetections: cropRecords.length,
          soilDetections: soilRecords.length,
          weatherUpdates: weatherRecords.length,
          unreadMessages: messages.length,
          activeRisks: yieldOutlook.highCropRisks + yieldOutlook.lowFertilitySoils + (weatherSummary.droughtRisk === 'high' ? 1 : 0)
        },
        subscription: sanitizeSubscription(req.user.subscription),
        yieldOutlook,
        weatherSummary,
        cropRecords: cropRecords.slice(0, 6),
        soilRecords: soilRecords.slice(0, 6),
        weatherRecords: weatherRecords.slice(0, 4),
        messages
      }
    });
  } catch (error) {
    console.error('[getFarmerOverview]', error);
    res.status(500).json({ success: false, message: 'Failed to load farmer dashboard' });
  }
};

const getSubscription = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        plans: subscriptionPlans,
        subscription: sanitizeSubscription(req.user.subscription)
      }
    });
  } catch (error) {
    console.error('[getSubscription]', error);
    res.status(500).json({ success: false, message: 'Failed to load subscription' });
  }
};

const subscribeFarmer = async (req, res) => {
  try {
    const { planId, paymentPhone } = req.body;
    const plan = getPlanById(planId);

    if (!plan) {
      return res.status(400).json({
        success: false,
        message: 'Please choose a valid subscription plan'
      });
    }

    if (!paymentPhone || !/^\+?\d{9,15}$/.test(String(paymentPhone).trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid payment phone number'
      });
    }

    const startedAt = new Date();
    const expiresAt = new Date(startedAt);
    expiresAt.setDate(expiresAt.getDate() + plan.durationDays);

    const reference = `SF-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        subscription: {
          plan: plan.id,
          status: 'active',
          amount: plan.amount,
          currency: plan.currency,
          startedAt,
          expiresAt,
          paymentPhone: String(paymentPhone).trim(),
          reference
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: `${plan.name} subscription activated`,
      data: {
        subscription: sanitizeSubscription(user.subscription),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          location: user.location,
          farmSize: user.farmSize,
          primaryCrops: user.primaryCrops,
          language: user.language,
          role: user.role,
          subscription: sanitizeSubscription(user.subscription)
        }
      }
    });
  } catch (error) {
    console.error('[subscribeFarmer]', error);
    res.status(500).json({ success: false, message: 'Failed to activate subscription' });
  }
};

module.exports = {
  getFarmerOverview,
  getSubscription,
  subscribeFarmer
};
