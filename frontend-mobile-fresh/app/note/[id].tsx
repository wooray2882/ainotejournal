import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useNotes } from '@/hooks/useNotes';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

export default function EditNoteScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { notes, updateNote, deleteNote, loading } = useNotes();
  const { colors } = useTheme();
  const [note, setNote] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const found = notes.find((n) => n.id === id);
    if (found) {
      setNote(found);
      setTitle(found.title);
      setContent(found.content);
      setTags(found.tags || []);
    }
  }, [id, notes]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title cannot be empty');
      return;
    }
    setIsSaving(true);
    try {
      await updateNote(id as string, {
        title: title.trim(),
        content: content.trim(),
        tags,
      });
      router.back();
    } catch (err) {
      Alert.alert('Error', 'Failed to update note');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await deleteNote(id as string);
            router.back();
          } catch (err) {
            Alert.alert('Error', 'Failed to delete note');
          }
        }
      }
    ]);
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

  if (!note) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 16 }}>Loading note...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={[styles.header, { backgroundColor: colors.card }]}> 
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}> 
          <Ionicons name="arrow-back" size={24} color={colors.text} /> 
        </TouchableOpacity> 
        <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Note</Text> 
        <TouchableOpacity 
          onPress={handleSave}
          disabled={isSaving || !title.trim()}
          style={[styles.saveButton, (!title.trim() || isSaving) && styles.saveButtonDisabled]}
        >
          <Text style={[styles.saveButtonText, { color: colors.primary }]}>Save</Text>
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
          {tags.filter(tag => tag.trim().length > 0).map((tag, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.tag, { backgroundColor: colors.primary + '20', marginRight: 8, marginBottom: 8 }]}
              onPress={() => removeTag(tag)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tagText, { color: '#000' }]} numberOfLines={1} ellipsizeMode="tail">{tag}</Text>
              <Ionicons name="close-circle" size={16} color={colors.primary} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.deleteButtonMain} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Note</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: '600' },
  saveButton: { padding: 8 },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: { fontSize: 16, fontWeight: '600' },
  titleInput: { fontSize: 24, fontWeight: '600', marginBottom: 16, padding: 16 },
  contentInput: { flex: 1, fontSize: 16, padding: 16, marginBottom: 16 },
  tagsContainer: { padding: 16 },
  tagInputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  tagInput: { flex: 1, fontSize: 16, padding: 8, marginRight: 8 },
  addTagButton: { padding: 8 },
  tagsList: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, minWidth: 40, backgroundColor: '#e0e0e0' },
  tagText: { fontSize: 14, flexShrink: 1 },
  deleteButtonMain: { margin: 16, padding: 12, backgroundColor: '#FF3B30', borderRadius: 8, alignItems: 'center' },
  deleteButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
}); 