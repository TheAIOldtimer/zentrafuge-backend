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

/**
 * Register a new user
 */
exports.registerUser = async (req, res) => {
  try {
    const { userId, email, name, buddyName, buddyVibe } = req.body;
    
    if (!userId || !email || !name) {
      return res.status(400).json({ 
        success: false, 
        message: 'UserId, email, and name are required' 
      });
    }
    
    // Check if user already exists
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (userDoc.exists) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }
    
    // Create new user
    await userRef.set({
      userId,
      email,
      name,
      buddyName: buddyName || 'Zentrafuge',
      buddyVibe: buddyVibe || 'calm',
      growthLevel: 1,
      growthPoints: 0,
      createdAt: admin.firestore.Timestamp.now()
    });
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        userId,
        email,
        name,
        buddyName: buddyName || 'Zentrafuge',
        buddyVibe: buddyVibe || 'calm',
        growthLevel: 1,
        growthPoints: 0
      }
    });
    
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get user profile
 */
exports.getUserProfile = async (req, res) => {
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
    
    // Remove sensitive information
    delete userData.password;
    
    res.status(200).json({
      success: true,
      user: userData
    });
    
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update user profile
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, buddyName, buddyVibe } = req.body;
    
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
    
    const updateData = {};
    
    if (name) updateData.name = name;
    if (buddyName) updateData.buddyName = buddyName;
    if (buddyVibe) updateData.buddyVibe = buddyVibe;
    
    await userRef.update(updateData);
    
    const updatedUserDoc = await userRef.get();
    const updatedUserData = updatedUserDoc.data();
    
    // Remove sensitive information
    delete updatedUserData.password;
    
    res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      user: updatedUserData
    });
    
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
