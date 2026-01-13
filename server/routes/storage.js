const express = require('express');
const router = express.Router();
const swiftController = require('../controllers/swiftController');
const { authMiddleware } = require('../middleware/auth');

// Containers
router.get('/containers', authMiddleware, swiftController.listContainers);
router.post('/containers', authMiddleware, swiftController.createContainer);
router.delete('/containers/:name', authMiddleware, swiftController.deleteContainer);

// Objects
router.get('/containers/:container/objects', authMiddleware, swiftController.listObjects);
router.put('/containers/:container/objects/:object_name', authMiddleware, swiftController.uploadObject);
router.delete('/containers/:container/objects/:object_name', authMiddleware, swiftController.deleteObject);

module.exports = router;