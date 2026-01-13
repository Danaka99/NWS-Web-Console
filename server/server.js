const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const identityRoutes = require('./routes/identity');
const storageRoutes = require('./routes/storage');
const blockRoutes = require('./routes/block');
const computeRoutes = require('./routes/compute');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/identity', identityRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/block', blockRoutes);
app.use('/api/compute', computeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'NWS Backend' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 NWS Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
});