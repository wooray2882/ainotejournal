/* eslint-disable */
// WARNING: DO NOT EDIT. This file is automatically generated by AWS Amplify. It will be overwritten.
import { AmplifyConfig } from './types/amplify';

const awsmobile: AmplifyConfig = {
    aws_project_region: process.env.EXPO_PUBLIC_AWS_PROJECT_REGION!,
    aws_cognito_region: process.env.EXPO_PUBLIC_AWS_COGNITO_REGION!,
    aws_user_pools_id: process.env.EXPO_PUBLIC_AWS_USER_POOLS_ID!,
    aws_user_pools_web_client_id: process.env.EXPO_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID!,
    oauth: {},
    aws_appsync_graphqlEndpoint: process.env.EXPO_PUBLIC_AWS_APPSYNC_GRAPHQL_ENDPOINT!,
    aws_appsync_region: process.env.EXPO_PUBLIC_AWS_APPSYNC_REGION!,
    aws_appsync_authenticationType: process.env.EXPO_PUBLIC_AWS_APPSYNC_AUTHENTICATION_TYPE!,
    aws_cloud_logic_custom: [
        {
            name: "AdminQueries",
            endpoint: "https://ziastfsexbcnffa6rvjqirxf3q.appsync-api.us-east-1.amazonaws.com/graphql",
            region: "us-east-1"
        }
    ],
    aws_user_files_s3_bucket: "ainotejournal86b1c07be0df49a2b05ff1654917a035c187f-dev",
    aws_user_files_s3_bucket_region: "us-east-1"
};

export default awsmobile; 