import { generateClient } from 'aws-amplify/api';

const getClient = () => generateClient();

export const createNote = async (input: {
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
}) => {
  const mutation = `
    mutation CreateNote($input: CreateNoteInput!) {
      createNote(input: $input) {
        id
        title
        content
        createdAt
        updatedAt
        isPinned
        tags
        owner
      }
    }
  `;

  try {
    const result = await getClient().graphql({
      query: mutation,
      variables: { input },
    });
    return result.data.createNote;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

export const updateNote = async (input: {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
}) => {
  const mutation = `
    mutation UpdateNote($input: UpdateNoteInput!) {
      updateNote(input: $input) {
        id
        title
        content
        createdAt
        updatedAt
        isPinned
        tags
        owner
      }
    }
  `;

  try {
    const result = await getClient().graphql({
      query: mutation,
      variables: { input },
    });
    return result.data.updateNote;
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

export const deleteNote = async (id: string) => {
  const mutation = `
    mutation DeleteNote($input: DeleteNoteInput!) {
      deleteNote(input: $input) {
        id
      }
    }
  `;

  try {
    const result = await getClient().graphql({
      query: mutation,
      variables: { input: { id } },
    });
    return result.data.deleteNote;
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
}; 