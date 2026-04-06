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

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Auth-Token']
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check (no auth required)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'NWS Backend',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint (no auth required)
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!', 
    cors: 'enabled',
    timestamp: new Date().toISOString()
  });
});

// Routes (with auth)
app.use('/api/identity', identityRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/block', blockRoutes);
app.use('/api/compute', computeRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 NWS Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 CORS enabled for: http://localhost:3000`);
});