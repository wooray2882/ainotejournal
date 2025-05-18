# AI Note Journal - Installation Guide

This guide will help you set up and run the AI Note Journal mobile application on iOS simulator.

## Prerequisites

- Node.js v18 or later
- npm v9 or later
- macOS (for iOS development)
- Xcode 14 or later with Command Line Tools installed
- CocoaPods
- AWS Account (for Amplify backend)

## Installation Steps

### 1. Install Dependencies

First, install all required npm packages:

```bash
# Navigate to the project directory
cd frontend-mobile

# Install npm dependencies
npm install
```

### 2. iOS-specific Setup

For iOS, you need to install CocoaPods dependencies:

```bash
# Install iOS pod dependencies
npx pod-install
```

### 3. Configure AWS Amplify

Make sure your Amplify backend is properly configured. The application expects an `aws-exports.ts` file in the `src` directory.

If you need to initialize Amplify in your project:

```bash
# Install Amplify CLI globally
npm install -g @aws-amplify/cli

# Configure Amplify
amplify configure

# Initialize Amplify in your project
amplify init

# Add authentication
amplify add auth

# Push changes to the cloud
amplify push
```

### 4. Run the App

You can now run the app on the iOS simulator:

```bash
# Start the app on iOS simulator
npm run ios
```

For development mode with hot reloading:

```bash
# Start Expo development server
npm start

# Then press 'i' to open iOS simulator
```

## Troubleshooting

### Common Issues and Fixes

1. **Missing Dependencies Error**
   
   If you see errors about missing dependencies, run:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Auth is undefined Error**
   
   This error occurs when Amplify isn't properly configured. Ensure that:
   - `aws-exports.ts` file exists
   - Amplify is properly imported and configured in `index.js`
   - You've run `amplify push` to deploy your backend resources

3. **Expo CLI Errors**
   
   If you encounter errors with the Expo CLI, try:
   ```bash
   npx expo start -c
   ```
   This clears the cache and starts a fresh session.

4. **iOS Build Failures**
   
   If iOS build fails, try:
   ```bash
   cd ios
   pod install --repo-update
   cd ..
   npm run ios
   ```

### Verifying Amplify Configuration

To verify your Amplify configuration:

```bash
# Check the status of your Amplify resources
amplify status

# Check if you're logged in to Amplify
amplify console auth
```

## Support

If you encounter any issues not covered in this guide, please check:

1. The Amplify troubleshooting guide in `/frontend-mobile/AMPLIFY_REACT_NATIVE_TROUBLESHOOTING.md`
2. AWS Amplify documentation: https://docs.amplify.aws/
3. Expo documentation: https://docs.expo.dev/ 