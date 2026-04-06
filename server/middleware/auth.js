const axios = require('axios');
const config = require('../config/openstack');

let cachedToken = null;
let tokenExpiry = null;

// Authenticate with Keystone
async function getAuthToken() {
  try {
    // Check if we have a valid cached token
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
      console.log('✅ Using cached token');
      return cachedToken;
    }

    console.log('🔐 Attempting authentication...');

    // Option 1: Using client credentials (OAuth2)
    if (process.env.OPENSTACK_CLIENT_ID && process.env.OPENSTACK_CLIENT_SECRET) {
      console.log('   Using client credentials');
      const response = await axios.post(`${config.keystone.url}/auth/tokens`, {
        auth: {
          identity: {
            methods: ['application_credential'],
            application_credential: {
              id: process.env.OPENSTACK_CLIENT_ID,
              secret: process.env.OPENSTACK_CLIENT_SECRET
            }
          }
        }
      }, {
        timeout: 5000 // 5 second timeout
      });

      cachedToken = response.headers['x-subject-token'];
      tokenExpiry = Date.now() + (50 * 60 * 1000);
      
      console.log('✅ Authenticated with OpenStack (client credentials)');
      return cachedToken;
    }

    // Option 2: Using username/password (fallback)
    if (config.keystone.adminUser && config.keystone.adminPassword) {
      console.log('   Using username/password');
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
      }, {
        timeout: 5000
      });

      cachedToken = response.headers['x-subject-token'];
      tokenExpiry = Date.now() + (50 * 60 * 1000);
      
      console.log('✅ Authenticated with OpenStack (password)');
      return cachedToken;
    }

    throw new Error('No authentication credentials configured');
    
  } catch (error) {
    console.error('❌ Authentication error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    return null; // Return null instead of throwing
  }
}

// Middleware - works in both authenticated and demo mode
async function authMiddleware(req, res, next) {
  try {
    // Try to get token from request header first
    let token = req.headers['x-auth-token'];
    
    // If no token in header, try to get from OpenStack
    if (!token) {
      token = await getAuthToken();
    }
    
    req.authToken = token;
    req.demoMode = !token; // Flag if we're in demo mode
    
    if (req.demoMode) {
      console.log('⚠️  Running in DEMO mode (no OpenStack connection)');
    }
    
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    req.authToken = null;
    req.demoMode = true;
    next(); // Continue anyway in demo mode
  }
}

module.exports = { getAuthToken, authMiddleware };