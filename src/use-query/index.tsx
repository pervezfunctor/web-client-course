import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { TodoList } from './ClientVirtualTodoList'

const queryClient = new QueryClient()

export const TodoApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoList />
    </QueryClientProvider>
  )
}
