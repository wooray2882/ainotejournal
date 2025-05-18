import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { router, useLocalSearchParams } from 'expo-router';

export default function ConfirmScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    console.log('Confirm screen mounted with email:', email);
    if (!email) {
      console.log('No email provided, redirecting to signup');
      Alert.alert('Error', 'Email address is missing', [
        {
          text: 'OK',
          onPress: () => router.replace('/(auth)/signup')
        }
      ]);
    }
    setIsInitializing(false);
  }, [email]);

  if (isInitializing) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const handleConfirm = async () => {
      if (!code) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    if (!email) {
      Alert.alert('Error', 'Email address is missing');
        return;
      }

      setIsLoading(true);
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: email,
        confirmationCode: code
      });

      if (isSignUpComplete) {
        Alert.alert(
          'Success',
          'Your account has been verified successfully!',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(auth)/login')
            }
          ]
        );
      } else {
        console.log('Next step:', nextStep);
        // Handle additional confirmation steps if needed
      }
    } catch (error: any) {
      console.log('Confirm error:', error);
      let errorMessage = 'Failed to verify account';
      
      if (error.name === 'CodeMismatchException') {
        errorMessage = 'Invalid verification code';
      } else if (error.name === 'ExpiredCodeException') {
        errorMessage = 'Verification code has expired. Please request a new one';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      Alert.alert('Error', 'Email address is missing');
      return;
    }

    setIsLoading(true);
    try {
      await resendSignUpCode({ username: email });
      Alert.alert('Success', 'A new verification code has been sent to your email');
    } catch (error: any) {
      console.log('Resend error:', error);
      let errorMessage = 'Failed to resend verification code';
      
      if (error.name === 'LimitExceededException') {
        errorMessage = 'Too many attempts. Please try again later';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
            
      <Text style={styles.subtitle}>
        Please enter the verification code sent to {email}
            </Text>

            <TextInput
              style={styles.input}
        placeholder="Verification Code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
        autoComplete="one-time-code"
            />

            <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleConfirm}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
          {isLoading ? 'Verifying...' : 'Verify Account'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
        style={styles.linkButton}
              onPress={handleResendCode}
              disabled={isLoading}
            >
        <Text style={styles.linkText}>Resend Verification Code</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>Back to Sign Up</Text>
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
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
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
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 2,
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
  backButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  backText: {
    color: '#666',
    fontSize: 16,
  },
}); 