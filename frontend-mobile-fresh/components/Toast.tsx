import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  type?: 'error' | 'success';
}

export function Toast({ message, visible, onHide, type = 'error' }: ToastProps) {
  const translateY = new Animated.Value(-100);

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY }] },
        type === 'error' ? styles.errorContainer : styles.successContainer,
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
    zIndex: 1000,
  },
  errorContainer: {
    backgroundColor: '#FF3B30',
  },
  successContainer: {
    backgroundColor: '#34C759',
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
}); 