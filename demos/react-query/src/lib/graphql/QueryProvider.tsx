import { ReactNode, useMemo } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useAuth } from '../nhost/AuthProvider';
import { createQueryClientWithNhost } from './queryClient';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const { nhost } = useAuth();
  
  // Create and memoize the query client using the nhost client
  const queryClient = useMemo(() => {
    return createQueryClientWithNhost(nhost);
  }, [nhost]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}