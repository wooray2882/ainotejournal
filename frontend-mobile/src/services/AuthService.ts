import { Amplify, Auth } from 'aws-amplify';
import awsExports from '../aws-exports';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure Amplify
Amplify.configure({
  ...awsExports,
  Analytics: {
    disabled: true,
  },
  Storage: {
    AWSS3: {
      bucket: awsExports.aws_user_files_s3_bucket,
      region: awsExports.aws_user_files_s3_bucket_region,
    }
  },
  authStorage: AsyncStorage,
});

export interface SignUpParams {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface SignInParams {
  username: string;
  password: string;
}

export interface ConfirmSignUpParams {
  username: string;
  code: string;
}

export interface ResetPasswordParams {
  username: string;
}

export interface ConfirmResetPasswordParams {
  username: string;
  code: string;
  newPassword: string;
}

/**
 * Service for handling authentication operations
 */
class AuthService {
  /**
   * Sign up a new user
   */
  async signUp(params: SignUpParams): Promise<any> {
    const { username, password, email, firstName, lastName } = params;
    
    try {
      const result = await Auth.signUp({
        username,
        password,
        attributes: {
          email,
          given_name: firstName,
          family_name: lastName,
        },
      });
      
      return result;
    } catch (error) {
      console.error('[AuthService] signUp error:', error);
      throw error;
    }
  }

  /**
   * Confirm sign up with verification code
   */
  async confirmSignUp(params: ConfirmSignUpParams): Promise<any> {
    const { username, code } = params;
    
    try {
      return await Auth.confirmSignUp(username, code);
    } catch (error) {
      console.error('[AuthService] confirmSignUp error:', error);
      throw error;
    }
  }

  /**
   * Sign in a user
   */
  async signIn(params: SignInParams): Promise<any> {
    const { username, password } = params;
    
    try {
      const user = await Auth.signIn(username, password);
      return user;
    } catch (error) {
      console.error('[AuthService] signIn error:', error);
      throw error;
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    try {
      await Auth.signOut();
    } catch (error) {
      console.error('[AuthService] signOut error:', error);
      throw error;
    }
  }

  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<any> {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return user;
    } catch (error) {
      console.error('[AuthService] getCurrentUser error:', error);
      return null;
    }
  }

  /**
   * Initialize a password reset
   */
  async forgotPassword(params: ResetPasswordParams): Promise<any> {
    const { username } = params;
    
    try {
      return await Auth.forgotPassword(username);
    } catch (error) {
      console.error('[AuthService] forgotPassword error:', error);
      throw error;
    }
  }

  /**
   * Complete the password reset process
   */
  async confirmForgotPassword(params: ConfirmResetPasswordParams): Promise<any> {
    const { username, code, newPassword } = params;
    
    try {
      return await Auth.forgotPasswordSubmit(username, code, newPassword);
    } catch (error) {
      console.error('[AuthService] confirmForgotPassword error:', error);
      throw error;
    }
  }

  /**
   * Check if a user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      await Auth.currentAuthenticatedUser();
      return true;
    } catch {
      return false;
    }
  }
}

export default new AuthService(); 