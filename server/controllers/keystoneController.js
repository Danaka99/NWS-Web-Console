const axios = require('axios');
const config = require('../config/openstack');

// Create User
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, description, enabled } = req.body;
    
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
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch users',
      details: error.message
    });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
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

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    await axios.delete(
      `${config.keystone.url}/users/${req.params.id}`,
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

// Get Projects
exports.getProjects = async (req, res) => {
  try {
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