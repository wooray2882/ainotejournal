import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useNotes } from '@/hooks/useNotes';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useFocusEffect } from '@react-navigation/native';

export default function NotesScreen() {
  const router = useRouter();
  const { notes, loading, error, deleteNote, refreshNotes } = useNotes();
  const { colors } = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      refreshNotes();
    }, [refreshNotes])
  );

  const handleNotePress = (id: string) => {
    router.push(`/note/${id}`);
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  const renderNoteItem = ({ item }: { item: any }) => {
    console.log('Rendering note item:', item);
    return (
      <TouchableOpacity
        style={[styles.noteCard, { backgroundColor: colors.card }]}
        onPress={() => handleNotePress(item.id)}
      >
        <View style={styles.noteHeader}>
          <Text style={[styles.noteTitle, { color: colors.text }]}>{item.title}</Text>
          {item.isPinned && (
            <Ionicons name="pin" size={16} color={colors.primary} />
          )}
          <TouchableOpacity
            onPress={() => handleDeleteNote(item.id)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
        <Text 
          style={[styles.noteContent, { color: colors.text + '80' }]}
          numberOfLines={2}
        >
          {item.content}
        </Text>
        <View style={styles.noteFooter}>
          <Text style={[styles.noteDate, { color: colors.text + '60' }]}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <View style={styles.tagsContainer}>
            {item.tags?.map((tag: string, index: number) => (
              <View 
                key={index} 
                style={[styles.tag, { backgroundColor: '#e0e0e0' }]}
              >
                <Text style={[styles.tagText, { color: '#000' }]}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.errorText, { color: '#FF3B30' }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={notes}
        renderItem={renderNoteItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.notesList}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.text + '80' }]}>
                No notes yet. Create your first note!
              </Text>
            </View>
          )
        }
      />
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/note/create')}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notesList: {
    padding: 16,
  },
  noteCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  noteContent: {
    fontSize: 16,
    marginBottom: 8,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteDate: {
    fontSize: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 