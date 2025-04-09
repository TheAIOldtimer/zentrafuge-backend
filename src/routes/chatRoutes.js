const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Send a message to the AI buddy
router.post('/send', chatController.sendMessage);

// Get chat history for a user
router.get('/history/:userId', chatController.getChatHistory);

// Clear chat history for a user
router.delete('/history/:userId', chatController.clearChatHistory);

module.exports = router;
