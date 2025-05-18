import React, { useState, useEffect, useCallback } from 'react';
import { generateClient } from 'aws-amplify/api';
import { 
  listNotes, 
  getNote 
} from '../src/graphql/queries';
import { 
  createNote, 
  updateNote, 
  deleteNote 
} from '../src/graphql/mutations';
import { 
  onCreateNote, 
  onUpdateNote, 
  onDeleteNote 
} from '../src/graphql/subscriptions';
import { Note, CreateNoteInput, UpdateNoteInput } from '../src/API';

const getClient = () => generateClient();

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all notes
  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getClient().graphql({
        query: listNotes
      });
      console.log('Fetched notes result:', result);
      if ('data' in result && result.data.listNotes) {
        setNotes(result.data.listNotes.items);
        console.log('Notes set in state:', result.data.listNotes.items);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new note
  const createNewNote = async (noteData: CreateNoteInput) => {
    try {
      const result = await getClient().graphql({
        query: createNote,
        variables: { input: noteData }
      });
      console.log('Create note result:', result);
      if (result && 'data' in result && result.data && result.data.createNote) {
        setNotes(prev => [...prev, result.data.createNote]);
        setError(null);
        return result.data.createNote;
      } else {
        setError('Failed to create note: No data returned');
        throw new Error('No data returned');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
      throw err;
    }
  };

  // Update a note
  const updateExistingNote = async (id: string, noteData: Partial<UpdateNoteInput>) => {
    try {
      const result = await getClient().graphql({
        query: updateNote,
        variables: { input: { id, ...noteData } }
      });
      if (result && 'data' in result && result.data && result.data.updateNote) {
        setNotes(prev => 
          prev.map(note => 
            note.id === id ? result.data.updateNote : note
          )
        );
        setError(null);
        return result.data.updateNote;
      } else {
        setError('Failed to update note: No data returned');
        throw new Error('No data returned');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update note');
      throw err;
    }
  };

  // Delete a note
  const deleteExistingNote = async (id: string) => {
    try {
      await getClient().graphql({
        query: deleteNote,
        variables: { input: { id } }
      });
      setNotes(prev => prev.filter(note => note.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
      throw err;
    }
  };

  // Subscribe to real-time updates
  useEffect(() => {
    const resultCreate = getClient().graphql({
      query: onCreateNote as any
    });
    let createSubscription: any = null;
    if ('subscribe' in resultCreate && typeof resultCreate.subscribe === 'function') {
      createSubscription = resultCreate.subscribe({
        next: (msg: any) => {
          const newNote = msg?.value?.data?.onCreateNote;
          if (newNote) {
            setNotes(prev => [...prev, newNote]);
          }
        },
        error: (err: Error) => setError(err.message)
      });
    }

    const resultUpdate = getClient().graphql({
      query: onUpdateNote as any
    });
    let updateSubscription: any = null;
    if ('subscribe' in resultUpdate && typeof resultUpdate.subscribe === 'function') {
      updateSubscription = resultUpdate.subscribe({
        next: (msg: any) => {
          const updatedNote = msg?.value?.data?.onUpdateNote;
          if (updatedNote && updatedNote.id) {
            setNotes(prev => 
              prev.map(note => 
                note.id === updatedNote.id ? updatedNote : note
              )
            );
          }
        },
        error: (err: Error) => setError(err.message)
      });
    }

    const resultDelete = getClient().graphql({
      query: onDeleteNote as any
    });
    let deleteSubscription: any = null;
    if ('subscribe' in resultDelete && typeof resultDelete.subscribe === 'function') {
      deleteSubscription = resultDelete.subscribe({
        next: (msg: any) => {
          const deletedNote = msg?.value?.data?.onDeleteNote;
          if (deletedNote && deletedNote.id) {
            setNotes(prev => prev.filter(note => note.id !== deletedNote.id));
          }
        },
        error: (err: Error) => setError(err.message)
      });
    }

    // Initial fetch
    fetchNotes();

    // Cleanup subscriptions
    return () => {
      if (createSubscription) createSubscription.unsubscribe();
      if (updateSubscription) updateSubscription.unsubscribe();
      if (deleteSubscription) deleteSubscription.unsubscribe();
    };
  }, [fetchNotes]);

  return {
    notes,
    loading,
    error,
    createNote: createNewNote,
    updateNote: updateExistingNote,
    deleteNote: deleteExistingNote,
    refreshNotes: fetchNotes
  };
}; 