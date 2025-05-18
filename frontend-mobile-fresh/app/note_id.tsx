import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Text } from '@/components/Themed';
import { useLocalSearchParams, router } from 'expo-router';
import { useNotes } from '@/hooks/useNotes';
import { Ionicons } from '@expo/vector-icons';
import { Toast } from '@/components/Toast';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const { notes, updateExistingNote, deleteExistingNote } = useNotes();
  const note = notes.find(n => n.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  if (!note) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Note not found</Text>
      </View>
    );
  }

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      setShowToast(true);
      return;
    }

    try {
      setIsLoading(true);
      await updateExistingNote({
        ...note,
        title: title.trim(),
        content: content.trim(),
      });
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update note');
      setShowToast(true);
      console.error('Error updating note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteExistingNote(note.id);
      router.back();
    } catch (error) {
      setError('Failed to delete note');
      setShowToast(true);
      console.error('Error deleting note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePin = async () => {
    try {
      setIsLoading(true);
      await updateExistingNote({
        ...note,
        isPinned: !note.isPinned,
      });
    } catch (error) {
      setError('Failed to update note');
      setShowToast(true);
      console.error('Error updating note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Toast
        message={error || ''}
        visible={showToast}
        onHide={() => setShowToast(false)}
        type="error"
      />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={isLoading}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleTogglePin}
            disabled={isLoading}
          >
            <Ionicons
              name={note.isPinned ? 'pin' : 'pin-outline'}
              size={24}
              color={note.isPinned ? '#007AFF' : '#666'}
            />
          </TouchableOpacity>
          {isEditing ? (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#007AFF" />
              ) : (
                <Ionicons name="checkmark" size={24} color="#007AFF" />
              )}
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setIsEditing(true)}
                disabled={isLoading}
              >
                <Ionicons name="pencil" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleDelete}
                disabled={isLoading}
              >
                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {isEditing ? (
            <>
              <TextInput
                style={styles.titleInput}
                value={title}
                onChangeText={setTitle}
                placeholder="Title"
                placeholderTextColor="#666"
                editable={!isLoading}
              />
              <TextInput
                style={styles.contentInput}
                value={content}
                onChangeText={setContent}
                placeholder="Start writing..."
                placeholderTextColor="#666"
                multiline
                textAlignVertical="top"
                editable={!isLoading}
              />
            </>
          ) : (
            <>
              <Text style={styles.title}>{note.title}</Text>
              <Text style={styles.date}>
                {new Date(note.createdAt || '').toLocaleDateString()}
              </Text>
              <Text style={styles.body}>{note.content}</Text>
            </>
          )}
          {note.tags && note.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {note.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    minHeight: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#E8F0FE',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    color: '#007AFF',
    fontSize: 12,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
}); 