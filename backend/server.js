const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./src/config/database');

// Routes
const authRoutes = require('./src/routes/authRoutes');
const cropRoutes = require('./src/routes/cropRoutes');
const weatherRoutes = require('./src/routes/weatherRoutes');
const soilRoutes = require('./src/routes/soilRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const farmerRoutes = require('./src/routes/farmerRoutes');

const app = express();

// Connect Database
connectDB().then(() => console.log("MongoDB connected")).catch(err => console.error(err));

// Security middleware
app.use(helmet());

// CORS configuration for frontend
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
);

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/crop', cropRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/farmer', farmerRoutes);

// Health check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'SMART FARM API Server Running Successfully.'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
