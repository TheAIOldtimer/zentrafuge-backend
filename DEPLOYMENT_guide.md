# ZENTRAFUGE - Deployment Guide

This guide provides instructions for deploying the ZENTRAFUGE application to a production environment.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase account
- OpenAI API key

## Backend Deployment

### Option 1: Deploy to a VPS or Cloud Server

1. Clone the repository on your server:
   ```
   git clone https://github.com/your-username/zentrafuge.git
   cd zentrafuge/server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a production `.env` file:
   ```
   PORT=5000
   NODE_ENV=production
   OPENAI_API_KEY=your_openai_api_key_here
   FIREBASE_API_KEY=your_firebase_api_key_here
   FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
   FIREBASE_PROJECT_ID=your_firebase_project_id_here
   FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
   FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
   FIREBASE_APP_ID=your_firebase_app_id_here
   CLIENT_ORIGIN=https://your-frontend-domain.com
   ```

4. Build the TypeScript code:
   ```
   npm run build
   ```

5. Start the server:
   ```
   npm start
   ```

6. For production deployment, consider using a process manager like PM2:
   ```
   npm install -g pm2
   pm2 start dist/index.js --name zentrafuge-api
   ```

### Option 2: Deploy to a Serverless Platform

The ZENTRAFUGE backend can be adapted to run on serverless platforms like:

- AWS Lambda with API Gateway
- Google Cloud Functions
- Vercel Serverless Functions

Each platform will require specific adaptations to the code structure.

## Frontend Deployment

### Option 1: Deploy to Static Hosting

1. Update the production API URL in the client directory:
   ```
   # .env.production
   REACT_APP_API_URL=https://your-api-domain.com/api
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id_here
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
   REACT_APP_FIREBASE_APP_ID=your_firebase_app_id_here
   ```

2. Build the React application:
   ```
   cd client
   npm run build
   ```

3. Deploy the contents of the `build` directory to your static hosting provider:
   - Netlify
   - Vercel
   - GitHub Pages
   - Firebase Hosting
   - AWS S3 + CloudFront

### Option 2: Deploy to a Docker Container

1. Create a Dockerfile in the project root:
   ```
   # Frontend build stage
   FROM node:16 as frontend-build
   WORKDIR /app/client
   COPY client/package*.json ./
   RUN npm install
   COPY client/ ./
   RUN npm run build

   # Backend build stage
   FROM node:16 as backend-build
   WORKDIR /app/server
   COPY server/package*.json ./
   RUN npm install
   COPY server/ ./
   RUN npm run build

   # Final stage
   FROM node:16-alpine
   WORKDIR /app
   COPY --from=backend-build /app/server/dist ./dist
   COPY --from=backend-build /app/server/package*.json ./
   COPY --from=frontend-build /app/client/build ./public
   RUN npm install --production
   EXPOSE 5000
   CMD ["node", "dist/index.js"]
   ```

2. Build and run the Docker container:
   ```
   docker build -t zentrafuge .
   docker run -p 5000:5000 --env-file .env zentrafuge
   ```

## Database Setup

ZENTRAFUGE uses Firebase for authentication and data storage:

1. Create a new Firebase project at https://console.firebase.google.com/
2. Enable Authentication with Email/Password sign-in method
3. Create a Firestore database with the following collections:
   - `users`: Stores user profiles and conversation history
   - `buddyMessages`: Stores anonymous messages for the buddy-to-buddy feature
4. Set up security rules for your Firestore database:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /buddyMessages/{messageId} {
         allow read: if request.auth != null;
         allow create: if request.auth != null && request.resource.data.fromUserId == request.auth.uid;
       }
     }
   }
   ```

## SSL Configuration

For production deployment, ensure your application uses HTTPS:

1. Obtain an SSL certificate (Let's Encrypt is a free option)
2. Configure your web server (Nginx, Apache) to use the SSL certificate
3. Redirect all HTTP traffic to HTTPS

## Monitoring and Maintenance

1. Set up logging with a service like:
   - Loggly
   - Papertrail
   - ELK Stack

2. Implement monitoring for:
   - Server uptime
   - API response times
   - Error rates

3. Regular maintenance:
   - Keep dependencies updated
   - Monitor security advisories
   - Perform regular backups of your database

## Scaling Considerations

As your user base grows, consider:

1. Implementing a caching layer (Redis)
2. Setting up a load balancer for multiple backend instances
3. Optimizing database queries and indexes
4. Using a CDN for static assets

## Troubleshooting

Common deployment issues:

1. CORS errors: Ensure the `CLIENT_ORIGIN` environment variable is set correctly
2. Firebase connection issues: Verify Firebase credentials and security rules
3. OpenAI API errors: Check API key validity and rate limits

For additional deployment support, contact the development team.
