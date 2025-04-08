# ZENTRAFUGE Project Implementation - User Guide

## Introduction

Welcome to ZENTRAFUGE, an AI mental health companion that starts off needing your help but ultimately helps you through your interactions. This guide will walk you through how to use the application and get the most out of your experience.

## Getting Started

### Installation

1. Make sure you have the following prerequisites installed:
   - Node.js (v14 or higher)
   - npm (v6 or higher)

2. Clone the repository and install dependencies:
   ```
   git clone https://github.com/your-username/zentrafuge.git
   cd zentrafuge
   ```

3. Set up the backend:
   ```
   cd server
   npm install
   ```

4. Set up the frontend:
   ```
   cd ../client
   npm install
   ```

5. Create environment files:
   - In the server directory, create a `.env` file based on `.env.example`
   - In the client directory, create a `.env` file with the necessary variables

### Running the Application

1. Start the backend server:
   ```
   cd server
   npm run dev
   ```

2. Start the frontend application:
   ```
   cd client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Using ZENTRAFUGE

### Onboarding

When you first open ZENTRAFUGE, you'll go through an onboarding process:

1. **Enter Your Name**: Tell us what to call you.
2. **Name Your AI Buddy**: Give your AI companion a name.
3. **Choose a Vibe**: Select a personality for your buddy (calm, curious, shy, energetic, or wise).
4. **Create an Account**: Set up an account to save your progress (optional).

### Chat Interface

The main interface is a chat screen where you can interact with your AI buddy:

1. **Daily Prompts**: Each day, you'll receive a reflection prompt to help start meaningful conversations.
2. **Messaging**: Type messages to your buddy and receive responses that help you reflect on your thoughts and feelings.
3. **Growth System**: As you interact with your buddy, it will grow and evolve, becoming wiser and more helpful.

### Profile

Access your profile to:

1. **View Buddy Stats**: See your buddy's growth level and personality.
2. **Buddy-to-Buddy Ripple**: Send anonymous uplifting messages to other users or receive messages from them.
3. **Account Management**: Log out or manage your account.

## Features

### Growth System

Your AI buddy starts at Level 1 and can grow to Level 5:
- **Level 1**: 0-10 points - Your buddy is new and learning
- **Level 2**: 11-25 points - Your buddy is becoming more responsive
- **Level 3**: 26-50 points - Your buddy shows deeper understanding
- **Level 4**: 51-100 points - Your buddy offers insightful reflections
- **Level 5**: 101+ points - Your buddy has reached full potential

Each meaningful interaction earns growth points.

### Daily Prompts

Each day, you'll receive a new reflection prompt designed to encourage self-reflection and meaningful conversation. Click on the prompt to use it in your chat.

### Buddy-to-Buddy Ripple

This feature allows you to:
- Send anonymous uplifting messages to other users in the ZENTRAFUGE network
- Receive encouraging messages from other users
- Create a ripple effect of positivity throughout the community

## Troubleshooting

If you encounter issues:

1. **Chat Not Loading**: Ensure both the frontend and backend servers are running.
2. **Login Problems**: Try clearing your browser cache or resetting your password.
3. **Message Errors**: Check your internet connection and try again.

For additional help, please contact support at support@zentrafuge.com.

## Privacy & Data

ZENTRAFUGE takes your privacy seriously:
- Your conversations are stored securely
- Personal information is protected
- You can delete your account and data at any time

## Conclusion

ZENTRAFUGE is designed to grow with you. The more you interact with your AI buddy, the more it learns and evolves to provide better support. Remember, by helping your buddy grow, you're also helping yourself reflect and develop.

Enjoy your journey with ZENTRAFUGE!
