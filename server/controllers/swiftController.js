const axios = require('axios');
const config = require('../config/openstack');

// List Containers
exports.listContainers = async (req, res) => {
  try {
    const response = await axios.get(
      `${config.swift.url}/AUTH_${req.query.project_id || 'admin'}`,
      {
        headers: {
          'X-Auth-Token': req.authToken
        },
        params: {
          format: 'json'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to list containers',
      details: error.message
    });
  }
};

// Create Container
exports.createContainer = async (req, res) => {
  try {
    const { name, project_id } = req.body;
    
    await axios.put(
      `${config.swift.url}/AUTH_${project_id || 'admin'}/${name}`,
      {},
      {
        headers: {
          'X-Auth-Token': req.authToken
        }
      }
    );

    res.status(201).json({ message: 'Container created successfully', name });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to create container',
      details: error.message
    });
  }
};

// Delete Container
exports.deleteContainer = async (req, res) => {
  try {
    const { name } = req.params;
    const { project_id } = req.query;
    
    await axios.delete(
      `${config.swift.url}/AUTH_${project_id || 'admin'}/${name}`,
      {
        headers: {
          'X-Auth-Token': req.authToken
        }
      }
    );

    res.json({ message: 'Container deleted successfully' });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to delete container',
      details: error.message
    });
  }
};

// List Objects in Container
exports.listObjects = async (req, res) => {
  try {
    const { container } = req.params;
    const { project_id } = req.query;
    
    const response = await axios.get(
      `${config.swift.url}/AUTH_${project_id || 'admin'}/${container}`,
      {
        headers: {
          'X-Auth-Token': req.authToken
        },
        params: {
          format: 'json'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to list objects',
      details: error.message
    });
  }
};

// Upload Object
exports.uploadObject = async (req, res) => {
  try {
    const { container, object_name } = req.params;
    const { project_id } = req.query;
    
    await axios.put(
      `${config.swift.url}/AUTH_${project_id || 'admin'}/${container}/${object_name}`,
      req.body.data,
      {
        headers: {
          'X-Auth-Token': req.authToken,
          'Content-Type': req.body.content_type || 'application/octet-stream'
        }
      }
    );

    res.status(201).json({ message: 'Object uploaded successfully' });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to upload object',
      details: error.message
    });
  }
};

// Delete Object
exports.deleteObject = async (req, res) => {
  try {
    const { container, object_name } = req.params;
    const { project_id } = req.query;
    
    await axios.delete(
      `${config.swift.url}/AUTH_${project_id || 'admin'}/${container}/${object_name}`,
      {
        headers: {
          'X-Auth-Token': req.authToken
        }
      }
    );

    res.json({ message: 'Object deleted successfully' });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: 'Failed to delete object',
      details: error.message
    });
  }
};