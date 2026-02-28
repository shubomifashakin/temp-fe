"use client";

import {
  QueryClient,
  QueryClientProvider as TanstackQueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if ([401, 404, 400, 403].includes(error.cause as number)) {
          return false;
        }

        return failureCount < 3;
      },
      retryDelay: 3000,
      staleTime: 5 * 60 * 1000,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
});

export default function QueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}

      <ReactQueryDevtools initialIsOpen={false} />
    </TanstackQueryClientProvider>
  );
}
