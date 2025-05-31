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
