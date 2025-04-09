const express = require('express');
const router = express.Router();
const buddyController = require('../controllers/buddyController');

// Send a buddy-to-buddy message
router.post('/send', buddyController.sendBuddyMessage);

// Get a random buddy message
router.get('/random/:userId', buddyController.getRandomBuddyMessage);

// Get all buddy messages for a user
router.get('/all/:userId', buddyController.getAllBuddyMessages);

module.exports = router;
