# React Query with Nhost SDK

This guide demonstrates how to integrate GraphQL queries and mutations with React using TanStack Query (React Query) and the Nhost SDK.

## Setup

### 1. Install Dependencies

```bash
npm install @tanstack/react-query @nhost/nhost-js graphql
# or
yarn add @tanstack/react-query @nhost/nhost-js graphql
# or
pnpm add @tanstack/react-query @nhost/nhost-js graphql
```

For development, add React Query DevTools:

```bash
npm install -D @tanstack/react-query-devtools
```

### 2. Generate Types with GraphQL CodeGen

Install GraphQL CodeGen:

```bash
npm install -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/schema-ast
```

Set up `codegen.ts`:

```typescript
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    {
      "https://your-project-subdomain.region.nhost.run/v1": {
        headers: {
          "x-hasura-admin-secret": "your-admin-secret", // Development only
        },
      },
    },
  ],
  documents: ["src/**/*.ts", "src/**/*.tsx"],
  ignoreNoDocuments: true,
  generates: {
    "./src/lib/graphql/__generated__/graphql.ts": {
      documents: ["src/lib/graphql/**/*.graphql"],
      plugins: ["typescript", "typescript-operations"],
      config: {
        scalars: {
          UUID: "string",
          uuid: "string",
          timestamptz: "string",
          jsonb: "Record<string, any>",
          bigint: "number",
          bytea: "Buffer",
          citext: "string",
        },
      },
    },
    "./schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
      },
    },
  },
};

export default config;
```

#### Secure Schema Introspection Options

For production environments, it's recommended to use more secure approaches for schema introspection:

##### Option 1: Pre-generated schema file

```typescript
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./schema.graphql", // Use a downloaded schema file
  documents: ["src/**/*.ts", "src/**/*.tsx"],
  ignoreNoDocuments: true,
  generates: {
    // ... same as above
  },
};

export default config;
```

##### Option 2: Environment variables for secrets

```typescript
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    {
      [process.env.GRAPHQL_ENDPOINT || "https://your-project-subdomain.region.nhost.run/v1"]: {
        headers: {
          "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET || "", 
        },
      },
    },
  ],
  documents: ["src/**/*.ts", "src/**/*.tsx"],
  ignoreNoDocuments: true,
  generates: {
    // ... same as above
  },
};

export default config;
```

## Integration Guide

### 1. Create an Auth Provider

Create an authentication context to manage the user session:

```typescript
// src/lib/nhost/AuthProvider.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import { createClient, type NhostClient } from "@nhost/nhost-js";
import { type Session } from "@nhost/nhost-js/auth";

interface AuthContextType {
  user: Session["user"] | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  nhost: NhostClient;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Session["user"] | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Create the nhost client
  const nhost = useMemo(
    () =>
      createClient({
        region: import.meta.env.VITE_NHOST_REGION || "local",
        subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN || "local",
      }),
    [],
  );

  useEffect(() => {
    setIsLoading(true);
    const currentSession = nhost.getUserSession();
    setUser(currentSession?.user || null);
    setSession(currentSession);
    setIsAuthenticated(!!currentSession);
    setIsLoading(false);

    const unsubscribe = nhost.sessionStorage.onChange((currentSession) => {
      setUser(currentSession?.user || null);
      setSession(currentSession);
      setIsAuthenticated(!!currentSession);
    });

    return () => {
      unsubscribe();
    };
  }, [nhost]);

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated,
    isLoading,
    nhost,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
```

### 2. Create Query Provider

Set up React Query with the Nhost client:

```typescript
// src/lib/graphql/QueryProvider.tsx
import { type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient } from "@tanstack/react-query";

interface QueryProviderProps {
  children: ReactNode;
}

// Create a query client instance
const createQueryClient = () => {
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

export function QueryProvider({ children }: QueryProviderProps) {
  // Create the query client
  const queryClient = createQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 3. Create Authenticated Fetcher Hook

Create a utility to make authenticated GraphQL requests with the Nhost client:

```typescript
// src/lib/graphql/queryHooks.ts
import { useCallback } from "react";
import { useAuth } from "../nhost/AuthProvider";

// This wrapper returns a fetcher function that uses the authenticated nhost client
export const useAuthenticatedFetcher = <TData, TVariables>(
  document: string | { query: string; variables?: TVariables },
) => {
  const { nhost } = useAuth();

  return useCallback(
    async (variables?: TVariables): Promise<TData> => {
      // Handle both string format or document object format
      const query = typeof document === "string" ? document : document.query;
      const documentVariables =
        typeof document === "object" ? document.variables : undefined;
      const mergedVariables = variables || documentVariables;

      const resp = await nhost.graphql.post<TData>({
        query,
        variables: mergedVariables as Record<string, unknown>,
      });

      if (!resp.body.data) {
        throw new Error(
          `Response does not contain data: ${JSON.stringify(resp.body)}`,
        );
      }

      return resp.body.data;
    },
    [nhost],
  );
};
```

### 4. Set Up Your App Providers

Wrap your application with the Auth and Query providers:

```tsx
// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./lib/nhost/AuthProvider";
import { QueryProvider } from "./lib/graphql/QueryProvider";

// Root component that sets up providers
const Root = () => (
  <React.StrictMode>
    <AuthProvider>
      <QueryProvider>
        <App />
      </QueryProvider>
    </AuthProvider>
  </React.StrictMode>
);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(<Root />);
```

### 5. Define GraphQL Operations

Create a GraphQL file with your queries and mutations:

```graphql
# src/lib/graphql/operations.graphql
query GetNinjaTurtlesWithComments {
  ninjaTurtles {
    id
    name
    description
    createdAt
    comments {
      id
      comment
      createdAt
      user {
        id
        email
        displayName
      }
    }
  }
}

mutation AddComment($ninjaTurtleId: uuid!, $comment: String!) {
  insert_comments_one(
    object: { ninjaTurtleId: $ninjaTurtleId, comment: $comment }
  ) {
    id
  }
}
```

### 6. Generate TypeScript Types

Run the code generator:

```bash
npx graphql-codegen
```

You can also add a script to your package.json:

```json
{
  "scripts": {
    "codegen": "graphql-codegen --config codegen.ts"
  }
}
```

Then run:

```bash
npm run codegen
# or
yarn codegen
# or
pnpm codegen
```

### 7. Create Custom Query Hooks

After generating types, extend the generated types to create React Query hooks:

```typescript
// Add to src/lib/graphql/__generated__/graphql.ts

import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { useAuthenticatedFetcher } from "../queryHooks";

// Example query hook
export const useGetNinjaTurtlesWithCommentsQuery = (
  options?: Omit<
    UseQueryOptions<GetNinjaTurtlesWithCommentsQuery>,
    "queryKey" | "queryFn"
  >
) => {
  const fetcher = useAuthenticatedFetcher<
    GetNinjaTurtlesWithCommentsQuery,
    GetNinjaTurtlesWithCommentsQueryVariables
  >(GetNinjaTurtlesWithCommentsDocument);

  return useQuery<GetNinjaTurtlesWithCommentsQuery>({
    queryKey: ["GetNinjaTurtlesWithComments"],
    queryFn: () => fetcher(),
    ...options,
  });
};

// Example mutation hook
export const useAddCommentMutation = (
  options?: Omit<
    UseMutationOptions<
      AddCommentMutation,
      Error,
      AddCommentMutationVariables
    >,
    "mutationFn"
  >
) => {
  const fetcher = useAuthenticatedFetcher<
    AddCommentMutation,
    AddCommentMutationVariables
  >(AddCommentDocument);

  return useMutation<AddCommentMutation, Error, AddCommentMutationVariables>({
    mutationFn: (variables) => fetcher(variables),
    ...options,
  });
};
```

### 8. Use in Components

Use the generated React Query hooks in your components:

```tsx
// src/pages/Home.tsx
import { type JSX } from "react";
import {
  useGetNinjaTurtlesWithCommentsQuery,
  useAddCommentMutation,
} from "../lib/graphql/__generated__/graphql";
import { useState } from "react";
import { useAuth } from "../lib/nhost/AuthProvider";
import { Navigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export default function Home(): JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  
  const queryClient = useQueryClient();

  // Query for data
  const {
    data,
    isLoading: loading,
    error,
  } = useGetNinjaTurtlesWithCommentsQuery();

  // Mutation hook
  const { mutate: addComment } = useAddCommentMutation({
    onSuccess: () => {
      setCommentText("");
      setActiveCommentId(null);
      // Invalidate and refetch the ninja turtles query to get updated data
      queryClient.invalidateQueries({
        queryKey: ["GetNinjaTurtlesWithComments"],
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  const handleAddComment = (turtleId: string) => {
    if (!commentText.trim()) return;

    addComment({
      ninjaTurtleId: turtleId,
      comment: commentText,
    });
  };

  if (loading) return <div>Loading ninja turtles...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Access the data
  const ninjaTurtles = data?.ninjaTurtles || [];

  return (
    <div>
      <h1>Ninja Turtles</h1>
      {ninjaTurtles.map((turtle) => (
        <div key={turtle.id}>
          <h2>{turtle.name}</h2>
          <p>{turtle.description}</p>

          {/* Comments section */}
          <div>
            <h3>Comments ({turtle.comments.length})</h3>

            {turtle.comments.map((comment) => (
              <div key={comment.id}>
                <p>{comment.comment}</p>
                <small>
                  By{" "}
                  {comment.user?.displayName ||
                    comment.user?.email ||
                    "Anonymous"}
                </small>
              </div>
            ))}

            {activeCommentId === turtle.id ? (
              <div>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add your comment..."
                />
                <div>
                  <button onClick={() => setActiveCommentId(null)}>
                    Cancel
                  </button>
                  <button onClick={() => handleAddComment(turtle.id)}>
                    Submit
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setActiveCommentId(turtle.id)}>
                Add a comment
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Environment Variables

Create a `.env` file with:

```
VITE_NHOST_REGION=your-region
VITE_NHOST_SUBDOMAIN=your-subdomain
```

## Authentication Operations

Handle sign-in/sign-up with Nhost:

```tsx
// Sign in
await nhost.auth.signIn({
  email: "user@example.com",
  password: "password123",
});

// Sign up
await nhost.auth.signUp({
  email: "newuser@example.com",
  password: "password123",
});

// Sign out
await nhost.auth.signOut();
```

## Best Practices

1. **Authentication Flow**: Use the `isAuthenticated` and `isLoading` states from the `useAuth` hook to control access to protected content.

2. **React Query Features**:
   - Use `invalidateQueries` to refresh data after mutations
   - Leverage `useQueryClient` to interact with the query cache
   - Take advantage of stale-time and caching for optimization

3. **Error Handling**: Always handle loading and error states in your components.

4. **Optimistic Updates**: For better UX, use optimistic updates with React Query:

```tsx
const queryClient = useQueryClient();

const { mutate } = useAddCommentMutation({
  // Optimistic update
  onMutate: async (newComment) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['GetNinjaTurtlesWithComments'] });
    
    // Snapshot the previous value
    const previousData = queryClient.getQueryData(['GetNinjaTurtlesWithComments']);
    
    // Optimistically update the cache
    queryClient.setQueryData(['GetNinjaTurtlesWithComments'], (old: any) => {
      // Add new comment to the cache
      return {
        ...old,
        // Update data structure according to your schema
      };
    });
    
    // Return snapshot to use in case of rollback
    return { previousData };
  },
  onError: (err, newComment, context) => {
    // Rollback on error
    if (context?.previousData) {
      queryClient.setQueryData(
        ['GetNinjaTurtlesWithComments'], 
        context.previousData
      );
    }
  },
  onSettled: () => {
    // Always refetch after error or success
    queryClient.invalidateQueries({ queryKey: ['GetNinjaTurtlesWithComments'] });
  },
});
```

5. **Secure Routes**: Create protected route components that redirect unauthenticated users:

```typescript
// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../lib/nhost/AuthProvider";

interface ProtectedRouteProps {
  redirectTo?: string;
}

export default function ProtectedRoute({
  redirectTo = "/signin",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  return <Outlet />;
}
```

Usage in your router setup:

```tsx
// In your router configuration
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="public" element={<PublicPage />} />
    
    {/* Protected routes */}
    <Route element={<ProtectedRoute />}>
      <Route path="profile" element={<Profile />} />
      <Route path="dashboard" element={<Dashboard />} />
    </Route>
  </Route>
</Routes>
```

6. **DevTools**: Use React Query DevTools during development to debug queries and inspect cache. The DevTools panel provides insights into:
   - All active queries in your application
   - Query states (loading, error, success)
   - Query data and timestamps
   - Query refetch capabilities
   - Cache inspection and manipulation

7. **Performance Optimization**: Fine-tune React Query settings for optimal performance:
   - Adjust `staleTime` based on how frequently your data changes
   - Use `keepPreviousData` for pagination to prevent UI flashing
   - Implement `prefetchQuery` for data you anticipate needing soon
   - Set appropriate `cacheTime` to control how long unused data stays in memory