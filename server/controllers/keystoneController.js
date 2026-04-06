const axios = require('axios');
const config = require('../config/openstack');

// In-memory storage for demo mode
let demoUsers = [
  {
    id: 'demo-1',
    name: 'admin',
    email: 'admin@nws.local',
    enabled: true,
    description: 'Demo admin user',
    created_at: new Date().toISOString()
  }
];

// Create User
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, description, enabled } = req.body;
    
    // DEMO MODE - No OpenStack connection
    if (req.demoMode || !req.authToken) {
      console.log('📝 Creating user in DEMO mode');
      const newUser = {
        id: `demo-${Date.now()}`,
        name,
        email,
        enabled: enabled !== undefined ? enabled : true,
        description: description || '',
        created_at: new Date().toISOString()
      };
      demoUsers.push(newUser);
      
      return res.status(201).json({
        user: newUser,
        demo_mode: true
      });
    }

    // REAL MODE - Connected to OpenStack
    console.log('📝 Creating user in OpenStack');
    const response = await axios.post(
      `${config.keystone.url}/users`,
      {
        user: {
          name,
          email,
          password,
          description,
          enabled: enabled !== undefined ? enabled : true,
          domain_id: 'default'
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': req.authToken
        }
      }
    );

    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error creating user:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to create user',
      details: error.response?.data || error.message
    });
  }
};

// Get All Users
exports.getUsers = async (req, res) => {
  try {
    // DEMO MODE
    if (req.demoMode || !req.authToken) {
      console.log('📋 Listing users in DEMO mode');
      return res.json({
        users: demoUsers,
        demo_mode: true
      });
    }

    // REAL MODE
    console.log('📋 Listing users from OpenStack');
    const response = await axios.get(
      `${config.keystone.url}/users`,
      {
        headers: {
          'X-Auth-Token': req.authToken
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    
    // Fallback to demo mode on error
    console.log('⚠️  Falling back to DEMO mode');
    res.json({
      users: demoUsers,
      demo_mode: true,
      error_fallback: true
    });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // DEMO MODE
    if (req.demoMode || !req.authToken) {
      console.log('🗑️  Deleting user in DEMO mode');
      demoUsers = demoUsers.filter(user => user.id !== id);
      return res.json({ 
        message: 'User deleted successfully (demo mode)',
        demo_mode: true
      });
    }

    // REAL MODE
    console.log('🗑️  Deleting user from OpenStack');
    await axios.delete(
      `${config.keystone.url}/users/${id}`,
      {
        headers: {
          'X-Auth-Token': req.authToken
        }
      }
    );

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to delete user',
      details: error.message
    });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    // DEMO MODE
    if (req.demoMode || !req.authToken) {
      const user = demoUsers.find(u => u.id === req.params.id);
      return res.json({ user, demo_mode: true });
    }

    // REAL MODE
    const response = await axios.get(
      `${config.keystone.url}/users/${req.params.id}`,
      {
        headers: {
          'X-Auth-Token': req.authToken
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch user',
      details: error.message
    });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    // DEMO MODE
    if (req.demoMode || !req.authToken) {
      const index = demoUsers.findIndex(u => u.id === req.params.id);
      if (index !== -1) {
        demoUsers[index] = { ...demoUsers[index], ...req.body };
        return res.json({ user: demoUsers[index], demo_mode: true });
      }
      return res.status(404).json({ error: 'User not found' });
    }

    // REAL MODE
    const response = await axios.patch(
      `${config.keystone.url}/users/${req.params.id}`,
      { user: req.body },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': req.authToken
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to update user',
      details: error.message
    });
  }
};

// Get Projects
exports.getProjects = async (req, res) => {
  try {
    // DEMO MODE
    if (req.demoMode || !req.authToken) {
      return res.json({
        projects: [
          { id: 'demo-proj-1', name: 'demo-project', enabled: true, description: 'Demo project' }
        ],
        demo_mode: true
      });
    }

    // REAL MODE
    const response = await axios.get(
      `${config.keystone.url}/projects`,
      {
        headers: {
          'X-Auth-Token': req.authToken
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch projects',
      details: error.message
    });
  }
};

// Create Project
exports.createProject = async (req, res) => {
  try {
    const { name, description, enabled } = req.body;
    
    // DEMO MODE
    if (req.demoMode || !req.authToken) {
      return res.status(201).json({
        project: {
          id: `demo-proj-${Date.now()}`,
          name,
          description,
          enabled: enabled !== undefined ? enabled : true
        },
        demo_mode: true
      });
    }

    // REAL MODE
    const response = await axios.post(
      `${config.keystone.url}/projects`,
      {
        project: {
          name,
          description,
          enabled: enabled !== undefined ? enabled : true,
          domain_id: 'default'
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': req.authToken
        }
      }
    );

    res.status(201).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to create project',
      details: error.response?.data || error.message
    });
  }
};

// Get Roles
exports.getRoles = async (req, res) => {
  try {
    // DEMO MODE
    if (req.demoMode || !req.authToken) {
      return res.json({
        roles: [
          { id: 'demo-role-1', name: 'admin' },
          { id: 'demo-role-2', name: 'member' }
        ],
        demo_mode: true
      });
    }

    // REAL MODE
    const response = await axios.get(
      `${config.keystone.url}/roles`,
      {
        headers: {
          'X-Auth-Token': req.authToken
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch roles',
      details: error.message
    });
  }
};

// Authenticate
exports.authenticate = async (req, res) => {
  try {
    const { username, password, project } = req.body;
    
    const response = await axios.post(
      `${config.keystone.url}/auth/tokens`,
      {
        auth: {
          identity: {
            methods: ['password'],
            password: {
              user: {
                name: username,
                domain: { name: 'default' },
                password: password
              }
            }
          },
          scope: {
            project: {
              name: project || 'admin',
              domain: { name: 'default' }
            }
          }
        }
      }
    );

    res.json({
      token: response.headers['x-subject-token'],
      user: response.data.token.user,
      project: response.data.token.project
    });
  } catch (error) {
    res.status(401).json({
      error: 'Authentication failed',
      details: error.message
    });
  }
};