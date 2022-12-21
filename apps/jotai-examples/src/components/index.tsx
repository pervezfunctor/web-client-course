import { Container } from '@chakra-ui/react'
import React from 'react'
import { TodoList } from './TodoList'

export const TodoApp = () => {
  return (
    <Container>
      <TodoList />
    </Container>
  )
}
