const axios = require('axios');
const config = require('../config/openstack');

// List Instances (Servers)
exports.listInstances = async (req, res) => {
  try {
    const response = await axios.get(
      `${config.nova.url}/servers/detail`,
      {
        headers: {
          'X-Auth-Token': req.authToken
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to list instances',
      details: error.message
    });
  }
};

// Create Instance
exports.createInstance = async (req, res) => {
  try {
    const { name, image_id, flavor_id, networks, key_name } = req.body;
    
    const response = await axios.post(
      `${config.nova.url}/servers`,
      {
        server: {
          name,
          imageRef: image_id,
          flavorRef: flavor_id,
          networks: networks || [{ uuid: 'auto' }],
          key_name: key_name || null
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
      error: 'Failed to create instance',
      details: error.response?.data || error.message
    });
  }
};

// Get Instance Details
exports.getInstance = async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await axios.get(
      `${config.nova.url}/servers/${id}`,
      {
        headers: {
          'X-Auth-Token': req.authToken
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to get instance',
      details: error.message
    });
  }
};

// Delete Instance
exports.deleteInstance = async (req, res) => {
  try {
    const { id } = req.params;
    
    await axios.delete(
      `${config.nova.url}/servers/${id}`,
      {
        headers: {
          'X-Auth-Token': req.authToken
        }
      }
    );

    res.json({ message: 'Instance deleted successfully' });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to delete instance',
      details: error.message
    });
  }
};

// Start Instance
exports.startInstance = async (req, res) => {
  try {
    const { id } = req.params;
    
    await axios.post(
      `${config.nova.url}/servers/${id}/action`,
      { 'os-start': null },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': req.authToken
        }
      }
    );

    res.json({ message: 'Instance started successfully' });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to start instance',
      details: error.message
    });
  }
};

// Stop Instance
exports.stopInstance = async (req, res) => {
  try {
    const { id } = req.params;
    
    await axios.post(
      `${config.nova.url}/servers/${id}/action`,
      { 'os-stop': null },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': req.authToken
        }
      }
    );

    res.json({ message: 'Instance stopped successfully' });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to stop instance',
      details: error.message
    });
  }
};

// Reboot Instance
exports.rebootInstance = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // SOFT or HARD
    
    await axios.post(
      `${config.nova.url}/servers/${id}/action`,
      { reboot: { type: type || 'SOFT' } },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': req.authToken
        }
      }
    );

    res.json({ message: 'Instance reboot initiated' });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to reboot instance',
      details: error.message
    });
  }
};

// List Flavors
exports.listFlavors = async (req, res) => {
  try {
    const response = await axios.get(
      `${config.nova.url}/flavors/detail`,
      {
        headers: {
          'X-Auth-Token': req.authToken
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to list flavors',
      details: error.message
    });
  }
};

// List Images
exports.listImages = async (req, res) => {
  try {
    const response = await axios.get(
      `${config.nova.url}/images/detail`,
      {
        headers: {
          'X-Auth-Token': req.authToken
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to list images',
      details: error.message
    });
  }
};