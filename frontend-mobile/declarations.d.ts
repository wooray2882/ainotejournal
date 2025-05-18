// For images, SVGs, and other file types
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
declare module '*.gif';

// For vector icons
// declare module '@react-native-vector-icons/Ionicons';
declare module '@react-native-vector-icons/MaterialIcons';
declare module '@react-native-vector-icons/MaterialCommunityIcons';
declare module '@react-native-vector-icons/FontAwesome';
declare module '@react-native-vector-icons/FontAwesome5';
declare module '@react-native-vector-icons/AntDesign';
declare module '@react-native-vector-icons/Entypo';
declare module '@react-native-vector-icons/EvilIcons';
declare module '@react-native-vector-icons/Feather';
declare module '@react-native-vector-icons/Foundation';
declare module '@react-native-vector-icons/Octicons';
declare module '@react-native-vector-icons/SimpleLineIcons';
declare module '@react-native-vector-icons/Zocial';

// Amplify Auth types
declare namespace AmplifyTypes {
  interface User {
    username: string;
    attributes: {
      email: string;
      email_verified: boolean;
      name?: string;
      sub: string;
      [key: string]: any;
    };
  }
}

// Note type definition
interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Add type definitions for the AWS Amplify config
interface AmplifyConfig {
  aws_project_region: string;
  aws_cognito_identity_pool_id: string;
  aws_cognito_region: string;
  aws_user_pools_id: string;
  aws_user_pools_web_client_id: string;
  oauth: object;
  aws_appsync_graphqlEndpoint: string;
  aws_appsync_region: string;
  aws_appsync_authenticationType: string;
  aws_cloud_logic_custom: Array<{
    name: string;
    endpoint: string;
    region: string;
  }>;
  aws_user_files_s3_bucket: string;
  aws_user_files_s3_bucket_region: string;
} 