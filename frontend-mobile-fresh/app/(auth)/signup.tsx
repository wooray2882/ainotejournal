import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signUp } from 'aws-amplify/auth';
import { router } from 'expo-router';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

      if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
        return;
      }

      if (!validatePassword(password)) {
      Alert.alert(
        'Error',
        'Password must be at least 8 characters long and contain uppercase, lowercase, and numbers'
      );
        return;
      }

      if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
        return;
      }

      setIsLoading(true);
    try {
      console.log('Starting signup process...');
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
          autoSignIn: true,
        },
      });
      
      console.log('Signup response:', { isSignUpComplete, userId, nextStep });
      
      if (isSignUpComplete || nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
        console.log('Navigating to confirmation screen...');
        router.push({
          pathname: '/(auth)/confirm',
          params: { email }
        } as any);
      } else {
        console.log('Next step:', nextStep);
        // Handle additional signup steps if needed
      }
    } catch (error: any) {
      console.log('SignUp error:', error);
      let errorMessage = 'Failed to sign up';
      
      if (error.name === 'UsernameExistsException') {
        errorMessage = 'An account with this email already exists';
      } else if (error.name === 'InvalidPasswordException') {
        errorMessage = 'Password does not meet requirements';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
            
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
                autoComplete="password-new"
              />

              <TextInput
        style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
        secureTextEntry
                autoComplete="password-new"
              />

            <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

      <TouchableOpacity 
        style={styles.linkButton}
        onPress={() => router.push('/(auth)/login')}
      >
        <Text style={styles.linkText}>Already have an account? Sign In</Text>
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