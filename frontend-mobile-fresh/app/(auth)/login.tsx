import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signIn, getCurrentUser } from 'aws-amplify/auth';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const { isSignedIn, nextStep } = await signIn({ 
        username: email, 
        password,
        options: {
          authFlowType: 'USER_PASSWORD_AUTH'
        }
      });

      if (isSignedIn) {
        const user = await getCurrentUser();
        console.log('User after sign-in:', user);
        router.replace('/(tabs)');
      } else if (nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
        // Navigate to confirmation screen with email
        router.push({
          pathname: '/(auth)/confirm',
          params: { email }
        });
      } else {
        console.log('Next step:', nextStep);
        // Handle additional auth steps if needed
      }
    } catch (error: any) {
      console.log('SignIn error:', error);
      let errorMessage = 'Failed to sign in';
      
      if (error.name === 'UserNotConfirmedException') {
        // Navigate to confirmation screen with email
        router.push({
          pathname: '/(auth)/confirm',
          params: { email }
        });
        return;
      } else if (error.name === 'NotAuthorizedException') {
        errorMessage = 'Incorrect email or password';
      } else if (error.name === 'UserNotFoundException') {
        errorMessage = 'No account found with this email';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
      />

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.linkButton}
        onPress={() => router.push('/(auth)/signup')}
      >
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
}); 