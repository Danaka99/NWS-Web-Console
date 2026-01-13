const axios = require('axios');
const config = require('../config/openstack');

// List Volumes
exports.listVolumes = async (req, res) => {
  try {
    const project_id = req.query.project_id || 'admin';
    const response = await axios.get(
      `${config.cinder.url}/${project_id}/volumes/detail`,
      {
        headers: {
          'X-Auth-Token': req.authToken
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to list volumes',
      details: error.message
    });
  }
};

// Create Volume
exports.createVolume = async (req, res) => {
  try {
    const project_id = req.body.project_id || 'admin';
    const { name, size, description, volume_type } = req.body;
    
    const response = await axios.post(
      `${config.cinder.url}/${project_id}/volumes`,
      {
        volume: {
          name,
          size,
          description,
          volume_type: volume_type || null
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
      error: 'Failed to create volume',
      details: error.response?.data || error.message
    });
  }
};

// Get Volume Details
exports.getVolume = async (req, res) => {
  try {
    const { id } = req.params;
    const project_id = req.query.project_id || 'admin';
    
    const response = await axios.get(
      `${config.cinder.url}/${project_id}/volumes/${id}`,
      {
        headers: {
          'X-Auth-Token': req.authToken
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to get volume',
      details: error.message
    });
  }
};

// Delete Volume
exports.deleteVolume = async (req, res) => {
  try {
    const { id } = req.params;
    const project_id = req.query.project_id || 'admin';
    
    await axios.delete(
      `${config.cinder.url}/${project_id}/volumes/${id}`,
      {
        headers: {
          'X-Auth-Token': req.authToken
        }
      }
    );

    res.json({ message: 'Volume deleted successfully' });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to delete volume',
      details: error.message
    });
  }
};

// List Volume Types
exports.listVolumeTypes = async (req, res) => {
  try {
    const project_id = req.query.project_id || 'admin';
    const response = await axios.get(
      `${config.cinder.url}/${project_id}/types`,
      {
        headers: {
          'X-Auth-Token': req.authToken
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to list volume types',
      details: error.message
    });
  }
};

// Create Snapshot
exports.createSnapshot = async (req, res) => {
  try {
    const project_id = req.body.project_id || 'admin';
    const { volume_id, name, description } = req.body;
    
    const response = await axios.post(
      `${config.cinder.url}/${project_id}/snapshots`,
      {
        snapshot: {
          volume_id,
          name,
          description,
          force: true
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
      error: 'Failed to create snapshot',
      details: error.response?.data || error.message
    });
  }
};