import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Auth } from 'aws-amplify';

// Import screens (we'll need to create these)
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ConfirmScreen from './screens/ConfirmScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  // Check authentication on load
  useEffect(() => {
    const checkToken = async () => {
      try {
        // Check if user is authenticated with Amplify
        const user = await Auth.currentAuthenticatedUser();
        setUserToken(user.signInUserSession.accessToken.jwtToken);
      } catch (error) {
        console.log('No authenticated user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  if (isLoading) {
    // Return loading component if needed
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken ? (
          // User is signed in
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
        ) : (
          // User is not signed in
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Confirm" component={ConfirmScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
