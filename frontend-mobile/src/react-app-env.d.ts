/// <reference types="react-native" />
/// <reference types="jest" />

declare module 'aws-amplify' {
  import { CognitoUser, AmplifyConfig, GraphQLOperation, GraphQLResult } from './types/amplify';

  export const Auth: {
    signUp(params: { username: string; password: string; attributes: Record<string, any> }): Promise<{ user: CognitoUser }>;
    confirmSignUp(username: string, code: string): Promise<any>;
    signIn(username: string, password: string): Promise<CognitoUser>;
    forgotPassword(username: string): Promise<any>;
    forgotPasswordSubmit(username: string, code: string, password: string): Promise<any>;
    signOut(): Promise<any>;
    currentAuthenticatedUser(): Promise<CognitoUser>;
    updateUserAttributes(user: CognitoUser, attributes: Record<string, string>): Promise<string>;
    changePassword(user: CognitoUser, oldPassword: string, newPassword: string): Promise<string>;
  };

  export const API: {
    graphql<T = any>(operation: GraphQLOperation): Promise<GraphQLResult<T>>;
  };

  export function graphqlOperation(query: string, variables?: Record<string, any>): GraphQLOperation;
  
  export const Amplify: {
    configure(config: AmplifyConfig): void;
    Auth: {
      currentAuthenticatedUser(): Promise<CognitoUser>;
    };
  };
}

declare module '@aws-sdk/client-bedrock-runtime' {
  export class BedrockRuntimeClient {
    constructor(config: { region: string });
    send(command: any): Promise<any>;
  }

  export class InvokeModelCommand {
    constructor(input: {
      modelId: string;
      contentType: string;
      accept: string;
      body: string;
    });
  }
} 