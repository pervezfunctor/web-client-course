import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { TodoList } from './PaginatedTodoList'

const queryClient = new QueryClient()

export const TodoApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoList />
    </QueryClientProvider>
  )
}
