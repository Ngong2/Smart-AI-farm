const User = require('../models/User');
const CropAnalysis = require('../models/CropAnalysis');
const SoilReport = require('../models/SoilReport');
const WeatherAdvice = require('../models/WeatherAdvice');
const AdminMessage = require('../models/AdminMessage');

const getDateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const getClimateStatus = (weatherRecords) => {
  const latest = weatherRecords[0];
  const forecast = latest?.forecast || [];
  const rainfallTotal = forecast.reduce((sum, day) => sum + Number(day.rainfall || 0), 0);
  const maxTemp = forecast.reduce((max, day) => Math.max(max, Number(day.temperature || 0)), latest?.currentWeather?.temperature || 0);
  const minHumidity = forecast.reduce((min, day) => Math.min(min, Number(day.humidity || 100)), latest?.currentWeather?.humidity || 100);
  const risks = latest?.advice?.weatherRisks || [];
  const riskText = risks.join(' ').toLowerCase();

  const droughtRisk =
    maxTemp >= 35 ||
    minHumidity <= 25 ||
    riskText.includes('drought') ||
    riskText.includes('heat');

  let rainOutlook = 'Low rain expected';
  if (rainfallTotal >= 30) rainOutlook = 'Strong rain expected';
  else if (rainfallTotal >= 10) rainOutlook = 'Moderate rain expected';

  return {
    currentTemperature: latest?.currentWeather?.temperature || null,
    currentHumidity: latest?.currentWeather?.humidity || null,
    rainfallTotal,
    maxTemp,
    minHumidity,
    droughtRisk: droughtRisk ? 'high' : 'normal',
    rainOutlook,
    latestAdvice: latest?.advice?.plantingAdvice || latest?.advice?.irrigationNeeds || ''
  };
};

const getYieldOutlook = (cropRecords) => {
  const total = cropRecords.length;
  const highSeverity = cropRecords.filter((record) => record.severity === 'High').length;
  const mediumSeverity = cropRecords.filter((record) => record.severity === 'Medium').length;
  const healthy = cropRecords.filter((record) => record.detectedDisease === 'Healthy').length;
  const issueRate = total ? Math.round(((highSeverity + mediumSeverity) / total) * 100) : 0;

  let status = 'Stable';
  if (issueRate >= 50) status = 'At risk';
  else if (issueRate >= 25) status = 'Watch closely';

  return {
    status,
    issueRate,
    healthyRate: total ? Math.round((healthy / total) * 100) : 0,
    highSeverity,
    mediumSeverity
  };
};

const getAdminOverview = async (req, res) => {
  try {
    const thirtyDaysAgo = getDateDaysAgo(30);

    const [
      users,
      cropRecords,
      soilRecords,
      weatherRecords,
      recentMessages
    ] = await Promise.all([
      User.find({ role: 'farmer' }).select('name email phone location primaryCrops createdAt').sort({ createdAt: -1 }).lean(),
      CropAnalysis.find({}).populate('userId', 'name email location').sort({ createdAt: -1 }).limit(50).lean(),
      SoilReport.find({}).populate('userId', 'name email location').sort({ createdAt: -1 }).limit(50).lean(),
      WeatherAdvice.find({}).populate('userId', 'name email location').sort({ createdAt: -1 }).limit(20).lean(),
      AdminMessage.find({}).populate('recipientId', 'name email location').sort({ createdAt: -1 }).limit(10).lean()
    ]);

    const recentCrops = cropRecords.filter((record) => new Date(record.createdAt) >= thirtyDaysAgo);
    const recentSoils = soilRecords.filter((record) => new Date(record.createdAt) >= thirtyDaysAgo);

    res.json({
      success: true,
      data: {
        summary: {
          users: users.length,
          cropDetections: cropRecords.length,
          soilDetections: soilRecords.length,
          recentCropDetections: recentCrops.length,
          recentSoilDetections: recentSoils.length,
          highCropRisk: cropRecords.filter((record) => record.severity === 'High').length,
          droughtRisk: getClimateStatus(weatherRecords).droughtRisk
        },
        yieldOutlook: getYieldOutlook(cropRecords),
        climate: getClimateStatus(weatherRecords),
        users,
        cropRecords: cropRecords.slice(0, 8),
        soilRecords: soilRecords.slice(0, 8),
        weatherRecords: weatherRecords.slice(0, 6),
        recentMessages
      }
    });
  } catch (error) {
    console.error('[getAdminOverview]', error);
    res.status(500).json({ success: false, message: 'Failed to load admin overview' });
  }
};

const getAdminUsers = async (req, res) => {
  try {
    const users = await User
      .find({ role: 'farmer' })
      .select('name email phone location farmSize primaryCrops createdAt')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    console.error('[getAdminUsers]', error);
    res.status(500).json({ success: false, message: 'Failed to load users' });
  }
};

const sendAdminMessage = async (req, res) => {
  try {
    const { targetType, recipientId, subject, message, category } = req.body;

    if (!['all', 'user'].includes(targetType)) {
      return res.status(400).json({ success: false, message: 'targetType must be all or user' });
    }

    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'Subject and message are required' });
    }

    if (targetType === 'user') {
      const recipient = await User.findOne({ _id: recipientId, role: 'farmer' });
      if (!recipient) {
        return res.status(404).json({ success: false, message: 'Recipient user not found' });
      }
    }

    const adminMessage = await AdminMessage.create({
      senderId: req.user._id,
      targetType,
      recipientId: targetType === 'user' ? recipientId : undefined,
      subject,
      message,
      category: category || 'general'
    });

    res.status(201).json({
      success: true,
      data: adminMessage,
      message: targetType === 'all'
        ? 'Message saved for all users'
        : 'Message saved for selected user'
    });
  } catch (error) {
    console.error('[sendAdminMessage]', error);
    res.status(500).json({ success: false, message: 'Failed to send admin message' });
  }
};

module.exports = {
  getAdminOverview,
  getAdminUsers,
  sendAdminMessage
};
