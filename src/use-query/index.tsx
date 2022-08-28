import { Heading } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { atom, Provider } from 'jotai'
import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { TodoList } from './client/Jotai'

const isProd = process.env.NODE_ENV === 'production'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: isProd,
      retry: isProd ? 3 : 0,
      staleTime: isProd ? 0 : 5 * 60 * 1000,
      useErrorBoundary: true,
    },
  },
})
const queryClientAtom = atom(queryClient)

const Fallback = ({ error }: any) => {
  return <Heading color="red">{JSON.stringify(error, null, 2)}</Heading>
}

export const TodoApp = () => {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <QueryClientProvider client={queryClient}>
        <Provider initialValues={[[queryClientAtom, queryClient]]}>
          <TodoList />
        </Provider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
