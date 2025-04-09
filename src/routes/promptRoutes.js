const express = require('express');
const router = express.Router();
const promptController = require('../controllers/promptController');

// Get a daily prompt for reflection
router.get('/daily', promptController.getDailyPrompt);

// Get all prompts
router.get('/all', promptController.getAllPrompts);

// Add a new prompt (admin only)
router.post('/add', promptController.addPrompt);

module.exports = router;
