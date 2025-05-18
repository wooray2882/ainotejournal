import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  ...props
}) => {
  const getButtonStyle = () => {
    let buttonStyle = styles.button;
    
    // Variant styles
    if (variant === 'primary') {
      buttonStyle = { ...buttonStyle, ...styles.primary };
    } else if (variant === 'secondary') {
      buttonStyle = { ...buttonStyle, ...styles.secondary };
    } else if (variant === 'outline') {
      buttonStyle = { ...buttonStyle, ...styles.outline };
    }
    
    // Size styles
    if (size === 'small') {
      buttonStyle = { ...buttonStyle, ...styles.small };
    } else if (size === 'medium') {
      buttonStyle = { ...buttonStyle, ...styles.medium };
    } else if (size === 'large') {
      buttonStyle = { ...buttonStyle, ...styles.large };
    }
    
    // Disabled style
    if (disabled || isLoading) {
      buttonStyle = { ...buttonStyle, ...styles.disabled };
    }
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    let baseTextStyle = styles.text;
    
    if (variant === 'primary') {
      baseTextStyle = { ...baseTextStyle, ...styles.primaryText };
    } else if (variant === 'secondary') {
      baseTextStyle = { ...baseTextStyle, ...styles.secondaryText };
    } else if (variant === 'outline') {
      baseTextStyle = { ...baseTextStyle, ...styles.outlineText };
    }
    
    if (size === 'small') {
      baseTextStyle = { ...baseTextStyle, ...styles.smallText };
    } else if (size === 'large') {
      baseTextStyle = { ...baseTextStyle, ...styles.largeText };
    }
    
    if (disabled || isLoading) {
      baseTextStyle = { ...baseTextStyle, ...styles.disabledText };
    }
    
    return baseTextStyle;
  };
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[getButtonStyle(), style]}
      activeOpacity={0.7}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? '#3498db' : '#ffffff'} 
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: '#3498db',
  },
  secondary: {
    backgroundColor: '#2ecc71',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#ffffff',
  },
  outlineText: {
    color: '#3498db',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  disabledText: {
    color: '#ffffff',
  },
});

export default Button; 