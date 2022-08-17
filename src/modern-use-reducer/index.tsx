import { Container } from '@chakra-ui/react'
import React from 'react'
import { TodoList } from './TodoList'
import { Provider } from './state'

export const TodoApp = () => (
  <Provider>
    <Container>
      <TodoList />
    </Container>
  </Provider>
)
