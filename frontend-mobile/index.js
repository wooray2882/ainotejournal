import 'react-native-get-random-values';
import { registerRootComponent } from 'expo';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import awsconfig from './src/aws-exports';

// Configure Amplify at the very beginning
Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
  authStorage: AsyncStorage,
});

import App from './src/App';

// Register the app
registerRootComponent(App); 