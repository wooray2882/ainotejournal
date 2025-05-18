import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Note } from './models';

// Define the type for our authentication state setter
export type SetAuthenticationFunction = (value: boolean) => void;

// Define the param list for our Stack Navigator screens
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  SignUp: undefined;
  Home: undefined;
  NoteDetail: { note: Note };
  CreateNote: undefined;
};

// Define props types for each screen
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>;
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type NoteDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'NoteDetail'>;
export type CreateNoteScreenProps = NativeStackScreenProps<RootStackParamList, 'CreateNote'>; 