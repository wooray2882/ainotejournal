import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
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
        <ThemedText type="title" style={styles.title}>
          Welcome to AI Note Journal
        </ThemedText>

        <ThemedView style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Quick Actions
          </ThemedText>
          
          <TouchableOpacity style={styles.actionButton}>
            <ThemedText style={styles.actionButtonText}>
              Create New Note
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <ThemedText style={styles.actionButtonText}>
              View Recent Notes
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <ThemedText style={styles.actionButtonText}>
              AI Assistant
            </ThemedText>
          </TouchableOpacity>
      </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Recent Activity
          </ThemedText>
          <ThemedText style={styles.placeholderText}>
            Your recent notes and activities will appear here
        </ThemedText>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#4a90e2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  signOutButton: {
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
