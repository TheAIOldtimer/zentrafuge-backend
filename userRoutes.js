const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register a new user
router.post('/register', userController.registerUser);

// Get user profile
router.get('/profile/:userId', userController.getUserProfile);

// Update user profile
router.put('/profile/:userId', userController.updateUserProfile);

module.exports = router;
