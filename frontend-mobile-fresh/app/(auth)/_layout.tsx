import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f8f9fa' },
        presentation: 'card',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen 
        name="confirm" 
        options={{ 
          presentation: 'modal',
          animation: 'slide_from_bottom',
          gestureEnabled: true,
        }} 
      />
    </Stack>
  );
} 