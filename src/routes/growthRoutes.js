const express = require('express');
const router = express.Router();
const growthController = require('../controllers/growthController');

// Get growth status for a user
router.get('/status/:userId', growthController.getGrowthStatus);

// Update growth status for a user
router.put('/status/:userId', growthController.updateGrowthStatus);

// Check if user has leveled up
router.get('/levelup/:userId', growthController.checkLevelUp);

module.exports = router;
