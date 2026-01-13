const express = require('express');
const router = express.Router();
const novaController = require('../controllers/novaController');
const { authMiddleware } = require('../middleware/auth');

// Instances
router.get('/instances', authMiddleware, novaController.listInstances);
router.post('/instances', authMiddleware, novaController.createInstance);
router.get('/instances/:id', authMiddleware, novaController.getInstance);
router.delete('/instances/:id', authMiddleware, novaController.deleteInstance);

// Instance Actions
router.post('/instances/:id/start', authMiddleware, novaController.startInstance);
router.post('/instances/:id/stop', authMiddleware, novaController.stopInstance);
router.post('/instances/:id/reboot', authMiddleware, novaController.rebootInstance);

// Resources
router.get('/flavors', authMiddleware, novaController.listFlavors);
router.get('/images', authMiddleware, novaController.listImages);

module.exports = router;