const admin = require('firebase-admin');
const firebaseConfig = require('../config/firebase');

// Initialize Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  }) ;
}


const db = admin.firestore();

// Daily prompts for reflection
const prompts = [
  "What made you smile today?",
  "What's something you're grateful for right now?",
  "What's a small act of kindness you experienced or witnessed recently?",
  "What's something you're looking forward to?",
  "What's a challenge you're facing, and how might you overcome it?",
  "What's something you've learned recently?",
  "What would you tell your younger self today?",
  "What's a quality you appreciate about yourself?",
  "What's a small step you could take toward a goal?",
  "What's something that brought you peace recently?",
  "What's a boundary you need to set or maintain?",
  "What's something you can let go of today?",
  "What's a way you could be kinder to yourself?",
  "What's a simple pleasure you could enjoy today?",
  "What's something you're proud of accomplishing?",
  "What's a way you could connect with someone today?",
  "What's a healthy habit you'd like to build?",
  "What's a thought pattern you'd like to change?",
  "What's something that inspires you?",
  "What's a way you could help someone else today?"
];

/**
 * Get a daily prompt for reflection
 */
exports.getDailyPrompt = async (req, res) => {
  try {
    // Get a random prompt
    const randomIndex = Math.floor(Math.random() * prompts.length);
    const prompt = prompts[randomIndex];
    
    res.status(200).json({
      success: true,
      prompt
    });
    
  } catch (error) {
    console.error('Error getting daily prompt:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving daily prompt',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all prompts
 */
exports.getAllPrompts = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      prompts
    });
    
  } catch (error) {
    console.error('Error getting all prompts:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving prompts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Add a new prompt (admin only)
 */
exports.addPrompt = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ 
        success: false, 
        message: 'Prompt is required' 
      });
    }
    
    // In a real application, you would add this to a database
    // For this example, we'll just return success
    
    res.status(201).json({
      success: true,
      message: 'Prompt added successfully',
      prompt
    });
    
  } catch (error) {
    console.error('Error adding prompt:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding prompt',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
