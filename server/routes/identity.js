const express = require('express');
const router = express.Router();
const keystoneController = require('../controllers/keystoneController');
const { authMiddleware } = require('../middleware/auth');

// Authentication
router.post('/auth', keystoneController.authenticate);

// Users
router.get('/users', authMiddleware, keystoneController.getUsers);
router.get('/users/:id', authMiddleware, keystoneController.getUserById);
router.post('/users', authMiddleware, keystoneController.createUser);
router.patch('/users/:id', authMiddleware, keystoneController.updateUser);
router.delete('/users/:id', authMiddleware, keystoneController.deleteUser);

// Projects
router.get('/projects', authMiddleware, keystoneController.getProjects);
router.post('/projects', authMiddleware, keystoneController.createProject);

// Roles
router.get('/roles', authMiddleware, keystoneController.getRoles);

module.exports = router;