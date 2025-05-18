import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AuthService from '../services/AuthService';

interface User {
  username: string;
  attributes: {
    email: string;
    given_name: string;
    family_name: string;
    sub: string;
    [key: string]: any;
  };
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (username: string, password: string, email: string, firstName: string, lastName: string) => Promise<any>;
  confirmSignUp: (username: string, code: string) => Promise<any>;
  forgotPassword: (username: string) => Promise<any>;
  confirmForgotPassword: (username: string, code: string, newPassword: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check authentication status on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const currentUser = await AuthService.getCurrentUser();
      if (currentUser) {
        setUser({
          username: currentUser.username,
          attributes: currentUser.attributes,
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      const user = await AuthService.signIn({ username, password });
      setUser({
        username: user.username,
        attributes: user.attributes,
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AuthService.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const signUp = async (username: string, password: string, email: string, firstName: string, lastName: string) => {
    try {
      return await AuthService.signUp({
        username,
        password,
        email,
        firstName,
        lastName,
      });
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const confirmSignUp = async (username: string, code: string) => {
    try {
      return await AuthService.confirmSignUp({ username, code });
    } catch (error) {
      console.error('Error confirming sign up:', error);
      throw error;
    }
  };

  const forgotPassword = async (username: string) => {
    try {
      return await AuthService.forgotPassword({ username });
    } catch (error) {
      console.error('Error initiating password reset:', error);
      throw error;
    }
  };

  const confirmForgotPassword = async (username: string, code: string, newPassword: string) => {
    try {
      return await AuthService.confirmForgotPassword({ username, code, newPassword });
    } catch (error) {
      console.error('Error confirming password reset:', error);
      throw error;
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    signIn,
    signOut,
    signUp,
    confirmSignUp,
    forgotPassword,
    confirmForgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 