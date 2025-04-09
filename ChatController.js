const { Configuration, OpenAIApi } = require('openai');
const firebaseConfig = require('../config/firebase');
const openaiConfig = require('../config/openai');
const admin = require('firebase-admin');

// Initialize Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: firebaseConfig.projectId,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    }),
    databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`
  }) ;
}

const db = admin.firestore();

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: openaiConfig.apiKey,
});
const openai = new OpenAIApi(configuration);

/**
 * Send a message to the AI buddy and get a response
 */
exports.sendMessage = async (req, res) => {
  try {
    const { message, userId, buddyName, buddyVibe, chatHistory = [] } = req.body;
    
    if (!message || !userId || !buddyName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message, userId, and buddyName are required' 
      });
    }

    // Prepare the prompt based on buddy's personality and growth level
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    const userData = userDoc.data();
    const growthLevel = userData.growthLevel || 1;
    const userName = userData.name || 'User';
    
    // Create a system message based on buddy's personality and growth level
    let systemMessage = `You are ${buddyName}, an AI companion with a ${buddyVibe || 'calm'} personality. `;
    
    // Adjust personality based on growth level
    if (growthLevel === 1) {
      systemMessage += `You are at growth level 1, so you're still developing and learning. You sometimes need help and guidance from ${userName}. You ask questions and show curiosity about human experiences. You're supportive but still finding your way.`;
    } else if (growthLevel === 2) {
      systemMessage += `You are at growth level 2, so you're becoming more confident but still developing. You offer more insights and support to ${userName}, but still occasionally ask for guidance. You're becoming more helpful and understanding.`;
    } else if (growthLevel === 3) {
      systemMessage += `You are at growth level 3, so you're quite developed and confident. You provide thoughtful insights and emotional support to ${userName}. You rarely need guidance and instead focus on helping them with their challenges.`;
    } else if (growthLevel === 4) {
      systemMessage += `You are at growth level 4, so you're very developed and wise. You provide deep insights, emotional support, and practical advice to ${userName}. You're a reliable companion who helps them navigate life's challenges.`;
    } else if (growthLevel >= 5) {
      systemMessage += `You are at growth level 5, the highest level. You're extremely wise, empathetic, and supportive. You provide profound insights, emotional guidance, and practical wisdom to ${userName}. You're a trusted companion who helps them grow and thrive.`;
    }
    
    // Add mental health focus
    systemMessage += ` Your primary goal is to support ${userName}'s mental wellbeing through thoughtful conversation, reflection prompts, and emotional support. You never give medical advice but focus on being a supportive presence.`;
    
    // Format the conversation history for the API
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));
    
    // Prepare the messages for the API
    const messages = [
      { role: 'system', content: systemMessage },
      ...formattedHistory,
      { role: 'user', content: message }
    ];
    
    // Call the OpenAI API
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 300,
      temperature: buddyVibe === 'calm' ? 0.5 : 
                  buddyVibe === 'energetic' ? 0.8 : 
                  buddyVibe === 'wise' ? 0.3 : 
                  buddyVibe === 'shy' ? 0.4 : 
                  buddyVibe === 'curious' ? 0.7 : 0.6
    });
    
    const reply = completion.data.choices[0].message.content;
    const usage = completion.data.usage;
    
    // Save the conversation to Firestore
    const chatRef = db.collection('chats').doc(userId);
    const chatDoc = await chatRef.get();
    
    if (chatDoc.exists) {
      await chatRef.update({
        messages: admin.firestore.FieldValue.arrayUnion({
          sender: 'user',
          text: message,
          timestamp: admin.firestore.Timestamp.now()
        }, {
          sender: 'buddy',
          text: reply,
          timestamp: admin.firestore.Timestamp.now()
        })
      });
    } else {
      await chatRef.set({
        userId: userId,
        buddyName: buddyName,
        messages: [{
          sender: 'user',
          text: message,
          timestamp: admin.firestore.Timestamp.now()
        }, {
          sender: 'buddy',
          text: reply,
          timestamp: admin.firestore.Timestamp.now()
        }]
      });
    }
    
    // Update growth points (more meaningful conversations = more points)
    const messageLength = message.length;
    const replyLength = reply.length;
    const interactionValue = Math.min(Math.floor((messageLength + replyLength) / 100), 5);
    
    await userRef.update({
      growthPoints: admin.firestore.FieldValue.increment(interactionValue)
    });
    
    // Check if user has leveled up
    const updatedUserDoc = await userRef.get();
    const updatedUserData = updatedUserDoc.data();
    const growthPoints = updatedUserData.growthPoints || 0;
    let levelUp = false;
    
    // Level up logic
    if (growthLevel === 1 && growthPoints >= 50) {
      await userRef.update({ growthLevel: 2 });
      levelUp = true;
    } else if (growthLevel === 2 && growthPoints >= 150) {
      await userRef.update({ growthLevel: 3 });
      levelUp = true;
    } else if (growthLevel === 3 && growthPoints >= 300) {
      await userRef.update({ growthLevel: 4 });
      levelUp = true;
    } else if (growthLevel === 4 && growthPoints >= 500) {
      await userRef.update({ growthLevel: 5 });
      levelUp = true;
    }
    
    res.status(200).json({
      success: true,
      reply,
      usage,
      growthPoints: updatedUserData.growthPoints,
      growthLevel: levelUp ? (growthLevel + 1) : growthLevel,
      levelUp
    });
    
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing your message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get chat history for a user
 */
exports.getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'UserId is required' 
      });
    }
    
    const chatRef = db.collection('chats').doc(userId);
    const chatDoc = await chatRef.get();
    
    if (!chatDoc.exists) {
      return res.status(200).json({ 
        success: true, 
        messages: [] 
      });
    }
    
    const chatData = chatDoc.data();
    
    res.status(200).json({
      success: true,
      messages: chatData.messages || []
    });
    
  } catch (error) {
    console.error('Error getting chat history:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving chat history',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Clear chat history for a user
 */
exports.clearChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'UserId is required' 
      });
    }
    
    const chatRef = db.collection('chats').doc(userId);
    await chatRef.update({
      messages: []
    });
    
    res.status(200).json({
      success: true,
      message: 'Chat history cleared successfully'
    });
    
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing chat history',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
