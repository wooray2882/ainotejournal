# AI Note Journal Mobile App

A React Native iOS mobile app for the AI Note Journal, built with Expo, AWS Amplify, and AWS Bedrock.

## Features

- User authentication with AWS Cognito
- Create, read, update, and delete notes
- Pin important notes
- Tag notes for organization
- AI-powered features using AWS Bedrock:
  - Auto-generate titles from content
  - Expand note content with AI
  - Future: AI-powered topic suggestions and summaries

## Tech Stack

- React Native
- Expo 53
- AWS Amplify
- GraphQL with AppSync
- AWS Bedrock for AI features
- AWS Cognito for authentication

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Expo CLI
- AWS Account
- iOS Simulator (via Xcode)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open the iOS simulator:
```bash
npm run ios
```

## Project Structure

```
frontend-mobile/
├── App.js                 # Main application entry point
├── app.json               # Expo configuration
├── assets/                # Images and assets
├── babel.config.js        # Babel configuration
├── src/
│   ├── components/        # Reusable UI components
│   ├── graphql/           # GraphQL queries and mutations
│   ├── screens/           # Screen components
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   └── aws-exports.js     # AWS Amplify configuration
```

## Amplify Setup

This project uses AWS Amplify for backend services. After cloning, you need to initialize Amplify:

```bash
amplify init
amplify add auth
amplify add api
amplify push
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
