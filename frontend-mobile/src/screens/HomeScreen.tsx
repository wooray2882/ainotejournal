import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { listNotes } from '../graphql/queries';
import { deleteNote, updateNote } from '../graphql/mutations';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  // Listen for navigation events to refresh notes when returning to this screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchNotes();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const noteData = await API.graphql(graphqlOperation(listNotes));
      const noteList = noteData.data.listNotes.items;
      
      // Sort notes by isPinned (pinned first) then by date (newest first)
      const sortedNotes = noteList.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setNotes(sortedNotes);
    } catch (error) {
      console.log('Error fetching notes:', error);
      Alert.alert('Error', 'Could not fetch notes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeleteNote = async (id) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await API.graphql(
                graphqlOperation(deleteNote, { input: { id } })
              );
              setNotes(notes.filter(note => note.id !== id));
            } catch (error) {
              console.error('Error deleting note:', error);
              Alert.alert('Error', 'Could not delete note');
            }
          },
        },
      ]
    );
  };

  const handleTogglePinned = async (note) => {
    try {
      const updatedNote = await API.graphql(
        graphqlOperation(updateNote, {
          input: {
            id: note.id,
            isPinned: !note.isPinned,
          },
        })
      );
      
      // Update the notes state
      setNotes(
        notes.map((n) =>
          n.id === note.id ? updatedNote.data.updateNote : n
        )
      );
      
      // Re-fetch to ensure correct ordering
      fetchNotes();
    } catch (error) {
      console.error('Error updating note:', error);
      Alert.alert('Error', 'Could not update note');
    }
  };

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      navigation.replace('Login');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Could not sign out');
    }
  };

  const renderNoteItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.noteCard, item.isPinned && styles.pinnedNote]}
      onPress={() => navigation.navigate('NoteDetail', { note: item })}
      testID={`note-${item.id}`}
    >
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.noteActions}>
          <TouchableOpacity
            onPress={() => handleTogglePinned(item)}
            style={styles.iconButton}
            testID={`pin-button-${item.id}`}
          >
            <Ionicons
              name={item.isPinned ? 'pin' : 'pin-outline'}
              size={22}
              color={item.isPinned ? '#4a90e2' : '#888'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteNote(item.id)}
            style={styles.iconButton}
            testID={`delete-button-${item.id}`}
          >
            <Ionicons name="trash-outline" size={22} color="#ff6b6b" />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.noteContent} numberOfLines={2}>{item.content}</Text>
      
      <View style={styles.noteFooter}>
        <Text style={styles.noteDate}>
          {moment(item.createdAt).format('MMM D, YYYY')}
        </Text>
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 2).map((tag, index) => (
              <Text key={index} style={styles.tag}>
                {tag}
              </Text>
            ))}
            {item.tags.length > 2 && (
              <Text style={styles.tag}>+{item.tags.length - 2}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          testID="logout-button"
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      {notes.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notes yet</Text>
          <Text style={styles.emptySubtext}>Tap the + button to create one</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          renderItem={renderNoteItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.notesList}
          testID="notes-list"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchNotes();
              }}
              testID="refresh-control"
            />
          }
        />
      )}
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateNote')}
        testID="create-note-button"
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#4a90e2',
    fontWeight: '600',
  },
  notesList: {
    padding: 15,
  },
  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pinnedNote: {
    borderLeftWidth: 4,
    borderLeftColor: '#4a90e2',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  noteActions: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 5,
    marginLeft: 10,
  },
  noteContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteDate: {
    fontSize: 12,
    color: '#999',
  },
  tagsContainer: {
    flexDirection: 'row',
  },
  tag: {
    fontSize: 12,
    color: '#4a90e2',
    backgroundColor: '#e8f1fc',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 5,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#4a90e2',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});

export default HomeScreen; 