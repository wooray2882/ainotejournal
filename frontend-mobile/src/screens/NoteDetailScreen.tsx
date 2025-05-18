import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import { updateNote } from '../graphql/mutations';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';

const NoteDetailScreen = ({ navigation, route }) => {
  const { note } = route.params;
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState(note.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isPinned, setIsPinned] = useState(note.isPinned || false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Error', 'Content is required');
      return;
    }

    setIsSaving(true);
    try {
      const updatedNote = {
        id: note.id,
        title: title.trim(),
        content: content.trim(),
        tags,
        isPinned,
      };

      await API.graphql(
        graphqlOperation(updateNote, { input: updatedNote })
      );

      // Exit edit mode
      setIsEditing(false);
      Alert.alert('Success', 'Note updated successfully');
      
    } catch (error) {
      console.error('Error updating note:', error);
      Alert.alert('Error', 'Could not update note');
    } finally {
      setIsSaving(false);
    }
  };

  const togglePin = async () => {
    setIsPinned(!isPinned);
    
    if (!isEditing) {
      // If not in edit mode, save the pin status immediately
      try {
        await API.graphql(
          graphqlOperation(updateNote, {
            input: {
              id: note.id,
              isPinned: !isPinned,
            },
          })
        );
      } catch (error) {
        console.error('Error updating pin status:', error);
        // Revert the state if update fails
        setIsPinned(isPinned);
        Alert.alert('Error', 'Could not update pin status');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={togglePin}
          testID="pin-button"
        >
          <Ionicons
            name={isPinned ? 'pin' : 'pin-outline'}
            size={24}
            color={isPinned ? '#4a90e2' : '#666'}
          />
        </TouchableOpacity>
        
        {isEditing ? (
          <TouchableOpacity
            style={[styles.headerButton, styles.saveButton]}
            onPress={handleSave}
            disabled={isSaving}
            testID="save-button"
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={toggleEdit}
            testID="edit-button"
          >
            <Ionicons name="pencil-outline" size={24} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          {isEditing ? (
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Title"
              testID="title-input"
            />
          ) : (
            <Text style={styles.title}>{title}</Text>
          )}

          <Text style={styles.date}>
            {moment(note.createdAt).format('MMMM D, YYYY [at] h:mm A')}
          </Text>

          {isEditing ? (
            <TextInput
              style={styles.contentInput}
              value={content}
              onChangeText={setContent}
              placeholder="Note content"
              multiline
              testID="content-input"
            />
          ) : (
            <Text style={styles.content}>{content}</Text>
          )}

          {isEditing && (
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                value={tagInput}
                onChangeText={setTagInput}
                placeholder="Add tag"
                returnKeyType="done"
                onSubmitEditing={handleAddTag}
                testID="tag-input"
              />
              <TouchableOpacity
                style={styles.addTagButton}
                onPress={handleAddTag}
                testID="add-tag-button"
              >
                <Text style={styles.addTagButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          )}

          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              <Text style={styles.tagSectionTitle}>Tags:</Text>
              <View style={styles.tagsList}>
                {tags.map((tag, index) => (
                  <View key={index} style={styles.tagItem}>
                    <Text style={styles.tagText}>{tag}</Text>
                    {isEditing && (
                      <TouchableOpacity
                        onPress={() => handleRemoveTag(tag)}
                        style={styles.removeTagButton}
                        testID={`remove-tag-button-${index}`}
                      >
                        <Ionicons name="close-circle" size={16} color="#666" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerButton: {
    padding: 8,
  },
  saveButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  contentInput: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 200,
    textAlignVertical: 'top',
    marginTop: 20,
  },
  tagInputContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
  },
  addTagButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addTagButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  tagsContainer: {
    marginTop: 20,
  },
  tagSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f1fc',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#4a90e2',
    fontSize: 14,
  },
  removeTagButton: {
    marginLeft: 4,
  },
});

export default NoteDetailScreen; 