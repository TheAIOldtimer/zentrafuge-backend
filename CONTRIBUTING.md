# Contributing to ZENTRAFUGE

Thank you for your interest in contributing to ZENTRAFUGE! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with the following information:
- A clear, descriptive title
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Environment details (browser, OS, etc.)

### Suggesting Features

We welcome feature suggestions! Please create an issue with:
- A clear, descriptive title
- Detailed description of the proposed feature
- Any relevant mockups or examples
- Explanation of why this feature would be valuable

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Run tests to ensure they pass
5. Commit your changes (`git commit -m 'Add some feature'`)
6. Push to the branch (`git push origin feature/your-feature-name`)
7. Open a Pull Request

## Development Setup

Follow these steps to set up the project for development:

1. Clone the repository
   ```
   git clone https://github.com/your-username/zentrafuge.git
   cd zentrafuge
   ```

2. Set up the backend
   ```
   cd server
   npm install
   ```

3. Set up the frontend
   ```
   cd ../client
   npm install
   ```

4. Create environment files as described in the README

5. Start the development servers
   ```
   # In the server directory
   npm run dev
   
   # In the client directory
   npm start
   ```

## Project Structure

```
zentrafuge/
├── client/                 # React frontend
│   ├── public/             # Static files
│   ├── src/                # Source code
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React context providers
│   │   ├── pages/          # Page components
│   │   ├── services/       # API and Firebase services
│   │   └── types/          # TypeScript type definitions
│   └── tests/              # Frontend tests
├── server/                 # Node.js backend
│   ├── src/                # Source code
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   └── tests/              # Backend tests
└── docs/                   # Documentation
```

## Coding Standards

### General Guidelines

- Write clean, readable, and maintainable code
- Follow the existing code style and patterns
- Add comments for complex logic
- Use meaningful variable and function names

### TypeScript

- Use TypeScript for type safety
- Define interfaces for data structures
- Use proper type annotations

### React

- Use functional components with hooks
- Keep components small and focused
- Use context for state that needs to be shared across components
- Follow React best practices

### Testing

- Write tests for new features
- Ensure existing tests pass before submitting a PR
- Aim for good test coverage

## License

By contributing to ZENTRAFUGE, you agree that your contributions will be licensed under the project's license.

Thank you for contributing to ZENTRAFUGE!
