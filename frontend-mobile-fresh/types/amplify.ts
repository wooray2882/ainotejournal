// Type definitions for AWS Amplify API
export interface AmplifyConfig {
  API?: {
    endpoints?: Array<{
      name: string;
      endpoint: string;
      region?: string;
      custom_header?: () => { [key: string]: string };
    }>;
    graphql_headers?: () => { [key: string]: string };
    graphql_endpoint?: string;
    graphql_endpoint_iam_region?: string;
  };
  Auth?: {
    identityPoolId?: string;
    region?: string;
    identityPoolRegion?: string;
    userPoolId?: string;
    userPoolWebClientId?: string;
    mandatorySignIn?: boolean;
    authenticationFlowType?: string;
    oauth?: {
      domain?: string;
      scope?: string[];
      redirectSignIn?: string;
      redirectSignOut?: string;
      responseType?: string;
    };
  };
  Storage?: {
    AWSS3?: {
      bucket?: string;
      region?: string;
      identityPoolId?: string;
    };
  };
  aws_project_region?: string;
  aws_cognito_identity_pool_id?: string;
  aws_cognito_region?: string;
  aws_user_pools_id?: string;
  aws_user_pools_web_client_id?: string;
  aws_appsync_graphqlEndpoint?: string;
  aws_appsync_region?: string;
  aws_appsync_authenticationType?: string;
  aws_user_files_s3_bucket?: string;
  aws_user_files_s3_bucket_region?: string;
  oauth?: Record<string, any>;
  aws_cloud_logic_custom?: Array<{
    name: string;
    endpoint: string;
    region: string;
  }>;
} 