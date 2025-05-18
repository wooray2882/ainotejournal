import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/context/AuthContext';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SplashScreen } from 'expo-router';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function RootLayoutNav() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate a loading state (you would typically check auth status here)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      SplashScreen.hideAsync();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4a90e2',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          headerTitle: 'AI Note Journal',
        }}
      />
      <Stack.Screen 
        name="auth/login" 
        options={{
          headerTitle: 'Sign In',
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="auth/register" 
        options={{
          headerTitle: 'Sign Up',
          headerShown: false,
        }}
      />
    </Stack>
  );
} 