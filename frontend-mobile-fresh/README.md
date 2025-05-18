# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# AI Note Journal Mobile App

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the `.env` file with your AWS configuration:
- `EXPO_PUBLIC_AWS_USER_POOL_ID`: Your AWS Cognito User Pool ID
- `EXPO_PUBLIC_AWS_USER_POOL_CLIENT_ID`: Your AWS Cognito User Pool Client ID
- `EXPO_PUBLIC_AWS_REGION`: Your AWS Region (e.g., us-east-1)
- `EXPO_PUBLIC_AWS_APPSYNC_URL`: Your AWS AppSync API URL

## Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on iOS simulator:
```bash
npm run ios
```

## Authentication Flow

The app uses AWS Cognito for authentication with the following flow:
1. Sign Up: Users can create a new account with email and password
2. Email Verification: Users must verify their email with a confirmation code
3. Sign In: Users can sign in with their verified email and password

## Tech Stack

- React Native with Expo
- AWS Amplify for backend services
- AWS Cognito for authentication
- AWS AppSync for GraphQL API
- AWS Bedrock for AI features
