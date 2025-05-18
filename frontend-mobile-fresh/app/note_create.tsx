import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useNotes } from '../hooks/useNotes';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

export default function CreateNoteScreen() {
  const router = useRouter();
  const { createNote, error, loading, refreshNotes } = useNotes();
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  const handleCreateNote = async () => {
    if (!title.trim()) {
      return;
    }

    try {
      const user = await getCurrentUser();
      console.log('Current user before note creation:', user);
      const session = await fetchAuthSession();
      // Print the JWT token if available
      const idToken = session.tokens?.idToken?.toString();
      const accessToken = session.tokens?.accessToken?.toString();
      console.log('ID Token:', idToken);
      console.log('Access Token:', accessToken);
      if (!user) {
        // Not signed in
        alert('You must be signed in to create a note.');
        router.replace('/(auth)/login');
        return;
      }
      await createNote({
        title: title.trim(),
        content: content.trim(),
        tags,
        isPinned: false,
      });
      refreshNotes();
      router.back();
    } catch (err) {
      console.error('Failed to create note:', err);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>New Note</Text>
        <TouchableOpacity 
          onPress={handleCreateNote}
          disabled={loading || !title.trim()}
          style={[
            styles.saveButton,
            (!title.trim() || loading) && styles.saveButtonDisabled
          ]}
        >
          {loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={[styles.saveButtonText, { color: colors.primary }]}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.titleInput, { color: colors.text }]}
        placeholder="Title"
        placeholderTextColor={colors.text + '80'}
        value={title}
        onChangeText={setTitle}
        maxLength={100}
      />

      <TextInput
        style={[styles.contentInput, { color: colors.text }]}
        placeholder="Start writing..."
        placeholderTextColor={colors.text + '80'}
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
      />

      <View style={styles.tagsContainer}>
        <View style={styles.tagInputContainer}>
          <TextInput
            style={[styles.tagInput, { color: colors.text }]}
            placeholder="Add tags..."
            placeholderTextColor={colors.text + '80'}
            value={currentTag}
            onChangeText={setCurrentTag}
            onSubmitEditing={addTag}
          />
          <TouchableOpacity onPress={addTag} style={styles.addTagButton}>
            <Ionicons name="add-circle" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.tagsList}>
          {tags.filter(tag => tag.trim().length > 0).map((tag, index) => {
            console.log('Rendering tag:', tag);
            return (
              <TouchableOpacity
                key={index}
                style={[styles.tag, { backgroundColor: colors.primary + '20', marginRight: 8, marginBottom: 8 }]}
                onPress={() => removeTag(tag)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.tagText, { color: '#000' }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {tag}
                </Text>
                <Ionicons name="close-circle" size={16} color={colors.primary} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: '#FF3B30' }]}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    padding: 16,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    padding: 16,
    marginBottom: 16,
  },
  tagsContainer: {
    padding: 16,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
    marginRight: 8,
  },
  addTagButton: {
    padding: 8,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 40,
    backgroundColor: '#e0e0e0',
  },
  tagText: {
    fontSize: 14,
    flexShrink: 1,
  },
  errorContainer: {
    padding: 16,
  },
  errorText: {
    fontSize: 14,
  },
}); 