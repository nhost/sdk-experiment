import { QueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { NhostClient } from '@nhost/nhost-js';

// Create a base GraphQL fetcher function
export async function fetchData<TData, TVariables>(
  query: string,
  variables?: TVariables,
  options?: RequestInit['headers'],
  nhostClient?: NhostClient
): Promise<TData> {
  if (!nhostClient) {
    throw new Error('Nhost client is required for fetching data');
  }
  
  // Get the current session and access token
  const resp = await nhostClient.refreshSession(60);
  const token = resp ? resp.accessToken : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options
  };

  const response = await fetch(nhostClient.graphql.url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables
    })
  });

  const json = await response.json();

  if (json.errors) {
    const { message } = json.errors[0];
    throw new Error(message);
  }

  return json.data;
}

// Create a query client with default settings
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10 * 1000, // 10 seconds
        refetchOnWindowFocus: true,
        retry: 1,
      },
    },
  });
};

// Create a query client with nhost instance
export const createQueryClientWithNhost = (nhostClient: NhostClient) => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10 * 1000, // 10 seconds
        refetchOnWindowFocus: true,
        retry: 1,
      },
    },
  });
};

// Custom hook to create and memoize the Query client
export const useQueryClient = (nhostClient: NhostClient) => {
  return useMemo(() => createQueryClientWithNhost(nhostClient), [nhostClient]);
};