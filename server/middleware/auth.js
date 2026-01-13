const axios = require('axios');
const config = require('../config/openstack');

// Authenticate with Keystone and get token
async function getAuthToken() {
  try {
    const response = await axios.post(`${config.keystone.url}/auth/tokens`, {
      auth: {
        identity: {
          methods: ['password'],
          password: {
            user: {
              name: config.keystone.adminUser,
              domain: { name: config.keystone.domain },
              password: config.keystone.adminPassword
            }
          }
        },
        scope: {
          project: {
            name: config.keystone.adminProject,
            domain: { name: config.keystone.domain }
          }
        }
      }
    });

    return response.headers['x-subject-token'];
  } catch (error) {
    console.error('Authentication error:', error.message);
    throw new Error('Failed to authenticate with OpenStack');
  }
}

// Middleware to verify and attach auth token
async function authMiddleware(req, res, next) {
  try {
    const token = req.headers['x-auth-token'] || await getAuthToken();
    req.authToken = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
}

module.exports = { getAuthToken, authMiddleware };