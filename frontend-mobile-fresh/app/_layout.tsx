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

import { useColorScheme } from '@/hooks/useColorScheme';

// Initialize Amplify with proper configuration
Amplify.configure({
  ...awsconfig,
  Auth: {
    ...awsconfig.Auth,
    storage: AsyncStorage,
  },
  Storage: {
    S3: {
      bucket: awsconfig.aws_user_files_s3_bucket,
      region: awsconfig.aws_user_files_s3_bucket_region,
    }
  }
});

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
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
