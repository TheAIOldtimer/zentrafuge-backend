# ZENTRAFUGE - AI Mental Health Companion

ZENTRAFUGE is an AI mental health companion application that starts off needing help from the user but ultimately helps the user through their interactions. It's like a digital buddy you grow together with.

## Features

- **User Onboarding**: Personalize your experience by naming yourself and your AI buddy, and choosing your buddy's personality vibe
- **Chat Interface**: Simple 1:1 text-based chat between user and AI buddy with distinct personality
- **Growth System**: Visual evolution as your AI buddy gets brighter, wiser, and friendlier as you support it
- **Daily Prompts & Reflections**: Inspirational quotes and story prompts to encourage self-reflection
- **Buddy-to-Buddy Ripple**: Send anonymous uplifting messages to other users, creating a loop of kindness
- **User Profile**: Store your name, buddy stage, and conversation history

## Technology Stack

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **LLM**: OpenAI GPT via API
- **Database**: Firebase for user data and authentication
- **Styling**: CSS with responsive design

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- OpenAI API key
- Firebase project with Firestore and Authentication enabled

### Backend Setup

1. Navigate to the server directory:
   ```
   cd zentrafuge/server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file and add your API keys:
   ```
   PORT=5000
   OPENAI_API_KEY=your_openai_api_key_here
   FIREBASE_API_KEY=your_firebase_api_key_here
   FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
   FIREBASE_PROJECT_ID=your_firebase_project_id_here
   FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
   FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
   FIREBASE_APP_ID=your_firebase_app_id_here
   ```

4. Build and start the server:
   ```
   npm run build
   npm start
   ```
   
   For development with hot-reloading:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```
   cd zentrafuge/client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the client directory:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id_here
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
   REACT_APP_FIREBASE_APP_ID=your_firebase_app_id_here
   ```

4. Start the development server:
   ```
   npm start
   ```

5. For production build:
   ```
   npm run build
   ```

## API Endpoints

### Chat API

- `POST /api/chat`: Send a message to the AI buddy
  - Request body: `{ message, userId, buddyName, buddyVibe, conversationHistory }`
  - Response: `{ reply, usage }`

- `GET /api/prompt`: Get a daily reflection prompt
  - Response: `{ prompt }`

- `POST /api/growth`: Update the buddy's growth level
  - Request body: `{ userId, growthPoints }`
  - Response: `{ userId, growthLevel, growthPoints, levelUp }`

- `POST /api/buddy-message`: Send an anonymous message to another user
  - Request body: `{ message, fromUserId }`
  - Response: `{ success, messageId }`

- `GET /api/buddy-message/:userId`: Get a random buddy message
  - Response: `{ message, received }`

## User Flow

1. User starts at the onboarding page where they enter their name and create their AI buddy
2. User chooses a personality vibe for their buddy
3. User creates an account (optional)
4. User is directed to the chat interface where they can interact with their buddy
5. As the user interacts, the buddy grows and evolves
6. User can access their profile to see growth progress and send/receive buddy messages

## Future Enhancements

- Mobile app version using React Native
- Voice interaction capabilities
- More sophisticated growth system with achievements
- Community features for group support
- Customizable buddy appearance
- Guided meditation and mindfulness exercises

## License

This project is licensed under the MIT License.
