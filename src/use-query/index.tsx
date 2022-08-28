import { Heading } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { atom, Provider } from 'jotai'
import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { TodoList } from './JotaiTodoList'

const queryClient = new QueryClient()
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
