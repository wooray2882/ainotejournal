import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import awsconfig from '../aws-exports';
import { useColorScheme } from 'react-native';

// Configure Amplify
console.log('Amplify config at runtime:', awsconfig);
console.log('ENV:', {
  EXPO_PUBLIC_AWS_PROJECT_REGION: process.env.EXPO_PUBLIC_AWS_PROJECT_REGION,
  EXPO_PUBLIC_AWS_COGNITO_REGION: process.env.EXPO_PUBLIC_AWS_COGNITO_REGION,
  EXPO_PUBLIC_AWS_USER_POOLS_ID: process.env.EXPO_PUBLIC_AWS_USER_POOLS_ID,
  EXPO_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID,
  EXPO_PUBLIC_AWS_APPSYNC_GRAPHQL_ENDPOINT: process.env.EXPO_PUBLIC_AWS_APPSYNC_GRAPHQL_ENDPOINT,
  EXPO_PUBLIC_AWS_APPSYNC_REGION: process.env.EXPO_PUBLIC_AWS_APPSYNC_REGION,
  EXPO_PUBLIC_AWS_APPSYNC_AUTHENTICATION_TYPE: process.env.EXPO_PUBLIC_AWS_APPSYNC_AUTHENTICATION_TYPE,
});
Amplify.configure(awsconfig);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        const inAuthGroup = segments[0] === '(auth)';
        
        if (!user && !inAuthGroup) {
          // Redirect to login if not authenticated
          router.replace('/(auth)/login');
        } else if (user && inAuthGroup) {
          // Redirect to home if authenticated
          router.replace('/(tabs)');
        }
      } catch (error) {
        console.log('Auth check error:', error);
        // Not authenticated
        if (segments[0] !== '(auth)') {
          router.replace('/(auth)/login');
        }
      }
    };

    checkAuth();
  }, [segments]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
          },
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
