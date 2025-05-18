import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { Auth } from 'aws-amplify';
import { useNavigation, useRoute } from '@react-navigation/native';

const ConfirmScreen = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { username } = route.params || {};

  const handleConfirmation = async () => {
    if (!code) {
      setError('Please enter the verification code');
      return;
    }

    if (!username) {
      setError('Username is missing. Please go back and try again');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await Auth.confirmSignUp(username, code);
      Alert.alert(
        'Success',
        'Your account has been verified successfully!',
        [
          {
            text: 'Proceed to Login',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error) {
      console.error('Error confirming sign up:', error);
      setError(error.message || 'Failed to verify account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!username) {
      setError('Username is missing. Please go back and try again');
      return;
    }

    try {
      setIsLoading(true);
      await Auth.resendSignUp(username);
      Alert.alert('Success', 'A new verification code has been sent to your email.');
    } catch (error) {
      console.error('Error resending code:', error);
      setError(error.message || 'Failed to resend verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Verify Your Account</Text>
            
            <Text style={styles.subtitle}>
              We've sent a verification code to your email. Please enter it below to complete your registration.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Verification Code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              autoCapitalize="none"
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity 
              style={[styles.button, isLoading ? styles.buttonDisabled : null]} 
              onPress={handleConfirmation}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Verifying...' : 'Verify Account'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.resendButton} 
              onPress={handleResendCode}
              disabled={isLoading}
            >
              <Text style={styles.resendText}>Resend Verification Code</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    marginHorizontal: 24,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fafafa',
    fontSize: 16,
    letterSpacing: 1,
  },
  errorText: {
    color: '#d73a49',
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#4a90e2',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#97bff0',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  resendText: {
    color: '#4a90e2',
    fontSize: 14,
    fontWeight: '500',
  },
  backButton: {
    marginTop: 12,
    alignSelf: 'center',
  },
  backText: {
    color: '#666',
    fontSize: 14,
  },
});

export default ConfirmScreen; 