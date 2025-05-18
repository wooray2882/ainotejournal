import { API, graphqlOperation } from 'aws-amplify';
import { createNote, updateNote, deleteNote } from '../graphql/mutations';
import { getNote, listNotes, searchNotes } from '../graphql/queries';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { 
  Note, 
  APIResponse, 
  ListNotesResponse, 
  GetNoteResponse, 
  CreateNoteResponse, 
  UpdateNoteResponse, 
  DeleteNoteResponse,
  SearchNotesResponse 
} from '../types/models';

export interface CreateNoteInput {
  title: string;
  content: string;
  tags?: string[];
  isPinned?: boolean;
}

export interface UpdateNoteInput {
  id: string;
  title?: string;
  content?: string;
  tags?: string[];
  isPinned?: boolean;
}

export default class NoteService {
  static async createNote(noteData: CreateNoteInput): Promise<Note> {
    const result = await API.graphql(
      graphqlOperation(createNote, { input: noteData })
    ) as APIResponse<CreateNoteResponse>;
    
    return result.data.createNote;
  }

  static async updateNote(noteData: UpdateNoteInput): Promise<Note> {
    const result = await API.graphql(
      graphqlOperation(updateNote, { input: noteData })
    ) as APIResponse<UpdateNoteResponse>;
    
    return result.data.updateNote;
  }

  static async deleteNote(noteId: string): Promise<Note> {
    const result = await API.graphql(
      graphqlOperation(deleteNote, { input: { id: noteId } })
    ) as APIResponse<DeleteNoteResponse>;
    
    return result.data.deleteNote;
  }

  static async getNote(noteId: string): Promise<Note> {
    const result = await API.graphql(
      graphqlOperation(getNote, { id: noteId })
    ) as APIResponse<GetNoteResponse>;
    
    return result.data.getNote;
  }

  static async listNotes(filter = null, limit = 100): Promise<Note[]> {
    const result = await API.graphql(
      graphqlOperation(listNotes, { 
        filter, 
        limit 
      })
    ) as APIResponse<ListNotesResponse>;
    
    return result.data.listNotes.items;
  }

  static async searchNotes(searchTerm: string): Promise<Note[]> {
    const filter = {
      or: [
        { title: { contains: searchTerm } },
        { content: { contains: searchTerm } },
        { tags: { contains: searchTerm } }
      ]
    };
    
    const result = await API.graphql(
      graphqlOperation(searchNotes, { 
        filter,
        limit: 100
      })
    ) as APIResponse<SearchNotesResponse>;
    
    return result.data.searchNotes.items;
  }

  // AWS Bedrock integration for AI features
  static async generateTitleFromContent(content: string): Promise<string> {
    try {
      // Create a client with your AWS credentials
      const client = new BedrockRuntimeClient({ region: "us-east-1" });

      const prompt = `Generate a concise title (maximum 6 words) for this text: "${content}"`;

      // Use Claude model
      const input = {
        modelId: "anthropic.claude-v2",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
          max_tokens_to_sample: 50,
          temperature: 0.7,
          top_p: 0.9,
        }),
      };

      const command = new InvokeModelCommand(input);
      const response = await client.send(command);

      // Parse the response
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      
      // Extract just the title from the response
      const title = responseBody.completion.trim();
      
      return title;
    } catch (error) {
      console.error("Error generating title:", error);
      throw error;
    }
  }

  static async expandContent(content: string): Promise<string> {
    try {
      // Create a client with your AWS credentials
      const client = new BedrockRuntimeClient({ region: "us-east-1" });

      const prompt = `Expand on the following text with more details, insights, and examples. Keep the same tone and style: "${content}"`;

      // Use Claude model
      const input = {
        modelId: "anthropic.claude-v2",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
          max_tokens_to_sample: 500,
          temperature: 0.8,
          top_p: 0.9,
        }),
      };

      const command = new InvokeModelCommand(input);
      const response = await client.send(command);

      // Parse the response
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      
      // Get the expanded content
      const expandedContent = responseBody.completion.trim();
      
      // Return the original content plus the expansion
      return `${content}\n\n${expandedContent}`;
    } catch (error) {
      console.error("Error expanding content:", error);
      throw error;
    }
  }
} 