const express = require('express');
const router = express.Router();
const cinderController = require('../controllers/cinderController');
const { authMiddleware } = require('../middleware/auth');

// Volumes
router.get('/volumes', authMiddleware, cinderController.listVolumes);
router.post('/volumes', authMiddleware, cinderController.createVolume);
router.get('/volumes/:id', authMiddleware, cinderController.getVolume);
router.delete('/volumes/:id', authMiddleware, cinderController.deleteVolume);

// Volume Types
router.get('/types', authMiddleware, cinderController.listVolumeTypes);

// Snapshots
router.post('/snapshots', authMiddleware, cinderController.createSnapshot);

module.exports = router;