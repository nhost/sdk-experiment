import { useCallback } from 'react';
import { useAuth } from '../nhost/AuthProvider';

// This wrapper returns a fetcher function that uses the authenticated nhost client
export const useAuthenticatedFetcher = <TData, TVariables>(
  document: string | { query: string, variables?: TVariables }
) => {
  const { nhost } = useAuth();

  return useCallback(
    async (variables?: TVariables): Promise<TData> => {
      try {
        // Handle both string format or document object format
        const query = typeof document === 'string' ? document : document.query;
        const documentVariables = typeof document === 'object' ? document.variables : undefined;
        const mergedVariables = variables || documentVariables;

        // Get the current session and access token
        const resp = await nhost.refreshSession(60);
        const token = resp ? resp.accessToken : null;

        const headers = {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        };

        const response = await fetch(nhost.graphql.url, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            query,
            variables: mergedVariables
          })
        });

        const json = await response.json();

        if (json.errors) {
          const { message } = json.errors[0] || { message: 'Unknown GraphQL error' };
          throw new Error(message);
        }

        return json.data;
      } catch (error) {
        console.error('GraphQL query error:', error);
        throw error;
      }
    },
    [nhost]
  );
};
