import { Container } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { TodoList } from './InfiniteTodoList'

const queryClient = new QueryClient()

export const TodoApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Container>
        <TodoList />
      </Container>
    </QueryClientProvider>
  )
}
