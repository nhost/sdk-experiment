import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useAuth } from "../nhost/AuthProvider";
import { useMemo } from "react";
import type { NhostClient } from "@nhost/nhost-js";

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: `https://local.graphql.local.nhost.run/v1`,
});

// Create a function that creates an Apollo client using the provided Nhost client
export const createApolloClient = (nhostClient: NhostClient) => {
  // Auth link to append headers
  const authLink = setContext(async (_, { headers }) => {
    // Get the authentication token from nhost
    const resp = await nhostClient.refreshSession(60);
    const token = resp ? resp.accessToken : null;

    // Return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  // Create ApolloLink instance
  const link = ApolloLink.from([authLink, httpLink]);

  // Create and return Apollo client
  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
    },
  });
};

// Hook to get the Apollo client using the nhost client from AuthProvider
export const useApolloClient = () => {
  const { nhost } = useAuth();

  return useMemo(() => createApolloClient(nhost), [nhost]);
};
