import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import { createNote } from '../graphql/mutations';
import { Ionicons } from '@expo/vector-icons';

const CreateNoteScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // For AI generation features
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

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

    setIsSubmitting(true);
    try {
      const newNote = {
        title: title.trim(),
        content: content.trim(),
        tags,
        isPinned,
      };

      await API.graphql(
        graphqlOperation(createNote, { input: newNote })
      );

      Alert.alert('Success', 'Note created successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating note:', error);
      Alert.alert('Error', 'Could not create note');
    } finally {
      setIsSubmitting(false);
    }
  };

  // AI-powered title generation from content
  const generateTitle = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please write some content first');
      return;
    }

    setIsGeneratingTitle(true);
    try {
      // Implement with AWS Bedrock when available
      // For now, simulate a delay
      setTimeout(() => {
        // Generate a title based on the first few words
        const words = content.split(' ');
        const generatedTitle = words.slice(0, 3).join(' ') + '...';
        setTitle(generatedTitle);
        setIsGeneratingTitle(false);
      }, 1000);
    } catch (error) {
      console.error('Error generating title:', error);
      Alert.alert('Error', 'Could not generate title');
      setIsGeneratingTitle(false);
    }
  };

  // AI-powered content expansion
  const expandContent = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please write some initial content first');
      return;
    }

    setIsGeneratingContent(true);
    try {
      // Implement with AWS Bedrock when available
      // For now, simulate a delay
      setTimeout(() => {
        setContent(content + '\n\nThis is where AI-generated content would appear using AWS Bedrock. The AI would expand on your initial thoughts and help you develop your ideas further.');
        setIsGeneratingContent(false);
      }, 1500);
    } catch (error) {
      console.error('Error expanding content:', error);
      Alert.alert('Error', 'Could not expand content');
      setIsGeneratingContent(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <TextInput
              style={styles.titleInput}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              testID="title-input"
            />
            <TouchableOpacity
              style={[
                styles.iconButton,
                isGeneratingTitle && styles.loadingButton,
              ]}
              onPress={generateTitle}
              disabled={isGeneratingTitle || !content.trim()}
              testID="generate-title-button"
            >
              <Ionicons name="flash-outline" size={20} color="#4a90e2" />
            </TouchableOpacity>
          </View>

          <View style={styles.pinContainer}>
            <TouchableOpacity
              style={styles.pinButton}
              onPress={() => setIsPinned(!isPinned)}
              testID="pin-button"
            >
              <Ionicons
                name={isPinned ? 'pin' : 'pin-outline'}
                size={20}
                color={isPinned ? '#4a90e2' : '#666'}
              />
              <Text style={styles.pinText}>
                {isPinned ? 'Pinned' : 'Pin this note'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contentInputContainer}>
            <TextInput
              style={styles.contentInput}
              placeholder="Start writing your note..."
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              testID="content-input"
            />
            <TouchableOpacity
              style={[
                styles.expandButton,
                isGeneratingContent && styles.loadingButton,
              ]}
              onPress={expandContent}
              disabled={isGeneratingContent || !content.trim()}
              testID="expand-content-button"
            >
              <Ionicons name="bulb-outline" size={20} color="#fff" />
              <Text style={styles.expandButtonText}>
                {isGeneratingContent ? 'Generating...' : 'Expand with AI'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              placeholder="Add tag"
              value={tagInput}
              onChangeText={setTagInput}
              returnKeyType="done"
              onSubmitEditing={handleAddTag}
              testID="tag-input"
            />
            <TouchableOpacity
              style={styles.addTagButton}
              onPress={handleAddTag}
              disabled={!tagInput.trim()}
              testID="add-tag-button"
            >
              <Text style={styles.addTagButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              <Text style={styles.tagSectionTitle}>Tags:</Text>
              <View style={styles.tagsList}>
                {tags.map((tag, index) => (
                  <View key={index} style={styles.tagItem}>
                    <Text style={styles.tagText}>{tag}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveTag(tag)}
                      style={styles.removeTagButton}
                      testID={`remove-tag-button-${index}`}
                    >
                      <Ionicons name="close-circle" size={16} color="#666" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isSubmitting}
            testID="save-button"
          >
            <Text style={styles.saveButtonText}>
              {isSubmitting ? 'Saving...' : 'Save Note'}
            </Text>
          </TouchableOpacity>
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
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  pinContainer: {
    marginBottom: 20,
  },
  pinButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinText: {
    marginLeft: 6,
    color: '#666',
    fontSize: 14,
  },
  contentInputContainer: {
    marginBottom: 20,
  },
  contentInput: {
    fontSize: 16,
    color: '#444',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 200,
    marginBottom: 10,
  },
  expandButton: {
    flexDirection: 'row',
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  expandButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  loadingButton: {
    opacity: 0.7,
  },
  tagInputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
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
    marginBottom: 20,
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
  saveButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateNoteScreen; 