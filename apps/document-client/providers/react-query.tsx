'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const queryClient = new QueryClient()

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  // ;<ReactQueryDevtools initialIsOpen={false} />
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
