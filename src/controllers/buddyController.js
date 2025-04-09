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
 * Send a buddy-to-buddy message
 */
exports.sendBuddyMessage = async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    if (!message || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message and userId are required' 
      });
    }
    
    // Check if user exists
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Create buddy message
    const buddyMessageRef = db.collection('buddyMessages').doc();
    await buddyMessageRef.set({
      message,
      senderId: userId,
      receiverId: null, // Will be assigned when someone receives it
      sent: admin.firestore.Timestamp.now(),
      received: null
    });
    
    res.status(201).json({
      success: true,
      message: 'Buddy message sent successfully',
      messageId: buddyMessageRef.id
    });
    
  } catch (error) {
    console.error('Error sending buddy message:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending buddy message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get a random buddy message
 */
exports.getRandomBuddyMessage = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'UserId is required' 
      });
    }
    
    // Check if user exists
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Get a random unassigned buddy message
    const buddyMessagesRef = db.collection('buddyMessages');
    const query = await buddyMessagesRef
      .where('receiverId', '==', null)
      .where('senderId', '!=', userId) // Don't get your own messages
      .limit(10) // Get a few to choose from randomly
      .get();
    
    if (query.empty) {
      return res.status(404).json({ 
        success: false, 
        message: 'No buddy messages available' 
      });
    }
    
    // Select a random message from the results
    const messages = [];
    query.forEach(doc => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    const randomIndex = Math.floor(Math.random() * messages.length);
    const selectedMessage = messages[randomIndex];
    
    // Update the message with the receiver info
    await buddyMessagesRef.doc(selectedMessage.id).update({
      receiverId: userId,
      received: admin.firestore.Timestamp.now()
    });
    
    res.status(200).json({
      success: true,
      message: selectedMessage.message,
      received: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error getting buddy message:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving buddy message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all buddy messages for a user
 */
exports.getAllBuddyMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'UserId is required' 
      });
    }
    
    // Check if user exists
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Get all messages sent by the user
    const sentMessagesRef = db.collection('buddyMessages');
    const sentQuery = await sentMessagesRef
      .where('senderId', '==', userId)
      .get();
    
    const sentMessages = [];
    sentQuery.forEach(doc => {
      sentMessages.push({
        id: doc.id,
        ...doc.data(),
        type: 'sent'
      });
    });
    
    // Get all messages received by the user
    const receivedMessagesRef = db.collection('buddyMessages');
    const receivedQuery = await receivedMessagesRef
      .where('receiverId', '==', userId)
      .get();
    
    const receivedMessages = [];
    receivedQuery.forEach(doc => {
      receivedMessages.push({
        id: doc.id,
        ...doc.data(),
        type: 'received'
      });
    });
    
    // Combine and sort by timestamp
    const allMessages = [...sentMessages, ...receivedMessages];
    allMessages.sort((a, b) => {
      const aTime = a.sent ? a.sent.toDate() : new Date(0);
      const bTime = b.sent ? b.sent.toDate() : new Date(0);
      return bTime - aTime; // Newest first
    });
    
    res.status(200).json({
      success: true,
      messages: allMessages
    });
    
  } catch (error) {
    console.error('Error getting buddy messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving buddy messages',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
