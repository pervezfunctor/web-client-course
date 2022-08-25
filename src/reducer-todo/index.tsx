import { Container } from '@chakra-ui/react'
import React from 'react'
import { Provider } from './state'
import { TodoList } from './TodoList'

export const TodoApp = () => (
  <Provider>
    <Container>
      <TodoList />
      {/* <App /> */}
    </Container>
  </Provider>
)
