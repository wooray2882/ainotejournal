import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <FontAwesome name="user-circle" size={80} color="#4a90e2" />
          </View>
          <ThemedText type="title" style={styles.name}>
            User Name
          </ThemedText>
          <ThemedText style={styles.email}>
            user@example.com
          </ThemedText>
        </View>

        <ThemedView style={styles.card}>
          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome name="cog" size={20} color="#666" />
            <ThemedText style={styles.menuItemText}>Settings</ThemedText>
            <FontAwesome name="chevron-right" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome name="bell" size={20} color="#666" />
            <ThemedText style={styles.menuItemText}>Notifications</ThemedText>
            <FontAwesome name="chevron-right" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome name="question-circle" size={20} color="#666" />
            <ThemedText style={styles.menuItemText}>Help & Support</ThemedText>
            <FontAwesome name="chevron-right" size={16} color="#666" />
          </TouchableOpacity>
        </ThemedView>

        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <ThemedText style={styles.signOutButtonText}>
            Sign Out
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
  },
  signOutButton: {
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 