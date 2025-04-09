const admin = require('firebase-admin');
const firebaseConfig = require('../config/firebase');

// Initialize Firebase if not already initialized
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

/**
 * Get growth status for a user
 */
exports.getGrowthStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'UserId is required' 
      });
    }
    
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    const userData = userDoc.data();
    
    res.status(200).json({
      success: true,
      growthLevel: userData.growthLevel || 1,
      growthPoints: userData.growthPoints || 0
    });
    
  } catch (error) {
    console.error('Error getting growth status:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving growth status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update growth status for a user
 */
exports.updateGrowthStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { points } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'UserId is required' 
      });
    }
    
    if (points === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Points are required' 
      });
    }
    
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    const userData = userDoc.data();
    const currentPoints = userData.growthPoints || 0;
    const currentLevel = userData.growthLevel || 1;
    const newPoints = currentPoints + points;
    
    // Update points
    await userRef.update({
      growthPoints: newPoints
    });
    
    // Check if user has leveled up
    let newLevel = currentLevel;
    let levelUp = false;
    
    if (currentLevel === 1 && newPoints >= 50) {
      newLevel = 2;
      levelUp = true;
    } else if (currentLevel === 2 && newPoints >= 150) {
      newLevel = 3;
      levelUp = true;
    } else if (currentLevel === 3 && newPoints >= 300) {
      newLevel = 4;
      levelUp = true;
    } else if (currentLevel === 4 && newPoints >= 500) {
      newLevel = 5;
      levelUp = true;
    }
    
    // Update level if needed
    if (levelUp) {
      await userRef.update({
        growthLevel: newLevel
      });
    }
    
    res.status(200).json({
      success: true,
      growthLevel: newLevel,
      growthPoints: newPoints,
      levelUp
    });
    
  } catch (error) {
    console.error('Error updating growth status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating growth status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Check if user has leveled up
 */
exports.checkLevelUp = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'UserId is required' 
      });
    }
    
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    const userData = userDoc.data();
    const currentPoints = userData.growthPoints || 0;
    const currentLevel = userData.growthLevel || 1;
    
    // Check if user has leveled up
    let levelUp = false;
    let newLevel = currentLevel;
    
    if (currentLevel === 1 && currentPoints >= 50) {
      newLevel = 2;
      levelUp = true;
    } else if (currentLevel === 2 && currentPoints >= 150) {
      newLevel = 3;
      levelUp = true;
    } else if (currentLevel === 3 && currentPoints >= 300) {
      newLevel = 4;
      levelUp = true;
    } else if (currentLevel === 4 && currentPoints >= 500) {
      newLevel = 5;
      levelUp = true;
    }
    
    // Update level if needed
    if (levelUp) {
      await userRef.update({
        growthLevel: newLevel
      });
    }
    
    res.status(200).json({
      success: true,
      growthLevel: newLevel,
      growthPoints: currentPoints,
      levelUp
    });
    
  } catch (error) {
    console.error('Error checking level up:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking level up',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
