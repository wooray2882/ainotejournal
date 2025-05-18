import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Home Screen - Will be implemented later
const HomeScreen = () => {
  // Placeholder component
  return null;
};

// Profile Screen - Will be implemented later
const ProfileScreen = () => {
  // Placeholder component
  return null;
};

// Define the tab navigation parameter types
type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
};

// Define the stack navigation parameter types
type MainStackParamList = {
  Main: undefined;
  // Add other screens here as needed
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

// Main Tab Navigator (bottom tabs)
const MainTabNavigator: React.FC = () => {
  const { signOut } = useAuth();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: 'gray',
        headerRight: () => (
          <TouchableOpacity
            onPress={signOut}
            style={{ marginRight: 16 }}
          >
            <Icon name="log-out-outline" size={24} color="#3498db" />
          </TouchableOpacity>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Main Stack Navigator (wraps the tab navigator)
const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      {/* Add other screens here as needed */}
    </Stack.Navigator>
  );
};

export default MainNavigator; 