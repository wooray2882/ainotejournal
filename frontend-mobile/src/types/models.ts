// Note model
export interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

// User model
export interface User {
  username: string;
  attributes: {
    email: string;
    name?: string;
    email_verified?: boolean;
    sub: string;
    [key: string]: any;
  };
}

// API response types
export interface APIResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations: Array<{
      line: number;
      column: number;
    }>;
    path: string[];
  }>;
}

export interface ListNotesResponse {
  listNotes: {
    items: Note[];
    nextToken?: string;
  };
}

export interface GetNoteResponse {
  getNote: Note;
}

export interface CreateNoteResponse {
  createNote: Note;
}

export interface UpdateNoteResponse {
  updateNote: Note;
}

export interface DeleteNoteResponse {
  deleteNote: Note;
}

export interface SearchNotesResponse {
  searchNotes: {
    items: Note[];
    nextToken?: string;
    total: number;
  };
} 