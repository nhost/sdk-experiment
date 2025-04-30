import Axios from 'axios';
import type {
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults
} from 'axios';

export interface GraphQLVariables {
  [key: string]: any;
}

export interface GraphQLRequest<T = any> {
  query: string;
  variables?: GraphQLVariables;
  operationName?: string;
}

export interface GraphQLError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
  extensions?: any;
}

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: GraphQLError[];
}

/**
 * Creates a GraphQL API client for interacting with Hasura GraphQL API
 * @param config - Axios configuration
 * @returns GraphQL client with axios instance and query methods
 */
export const createApiClient = (config?: CreateAxiosDefaults) => {
  const axiosInstance = Axios.create({
    ...config
  });

  /**
   * Execute a GraphQL operation (query or mutation)
   * @param request - GraphQL request object containing query and optional variables
   * @param options - Axios request configuration
   * @returns Promise with the GraphQL response
   */
  const executeOperation = <TData = any, TVariables = GraphQLVariables>(
    request: GraphQLRequest<TVariables>,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<GraphQLResponse<TData>>> => {
    return axiosInstance.post<GraphQLResponse<TData>>(
      '',
      request,
      options
    );
  };

  /**
   * Execute a GraphQL query
   * @param request - GraphQL request object containing query and optional variables
   * @param options - Axios request configuration
   * @returns Promise with the GraphQL response
   */
  const query = <TData = any, TVariables = GraphQLVariables>(
    request: GraphQLRequest<TVariables>,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<GraphQLResponse<TData>>> => {
    return executeOperation<TData, TVariables>(request, options);
  };

  /**
   * Execute a GraphQL mutation
   * @param request - GraphQL request object containing mutation and optional variables
   * @param options - Axios request configuration
   * @returns Promise with the GraphQL response
   */
  const mutation = <TData = any, TVariables = GraphQLVariables>(
    request: GraphQLRequest<TVariables>,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<GraphQLResponse<TData>>> => {
    return executeOperation<TData, TVariables>(request, options);
  };

  /**
   * Execute a GraphQL subscription (not implemented in REST client, requires WebSocket)
   * This is a placeholder for future implementation
   */
  const subscription = <TData = any, TVariables = GraphQLVariables>(
    _request: GraphQLRequest<TVariables>,
    _options?: AxiosRequestConfig
  ): Promise<AxiosResponse<GraphQLResponse<TData>>> => {
    throw new Error('Subscriptions are not supported in the REST GraphQL client. Use a WebSocket client instead.');
  };

  return {
    query,
    mutation,
    subscription,
    axios: axiosInstance
  };
};

export type QueryResult<TData = any> = AxiosResponse<GraphQLResponse<TData>>;
export type MutationResult<TData = any> = AxiosResponse<GraphQLResponse<TData>>;
export type SubscriptionResult<TData = any> = AxiosResponse<GraphQLResponse<TData>>; 