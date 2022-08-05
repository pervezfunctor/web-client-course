import { Container } from '@chakra-ui/react'
import React from 'react'
import { initialState } from '../todo'
import { todoReducer } from './reducer'
import { TodoList } from './TodoList'

export const TodoApp = () => {
  const [state, dispatch] = React.useReducer(todoReducer, initialState)
  const todoList = Array.from(state.values())

  return (
    <Container>
      <TodoList
        todoList={todoList}
        onToggle={id => dispatch({ type: 'toggleTodo', id })}
        onDelete={id => dispatch({ type: 'deleteTodo', id })}
      />
    </Container>
  )
}
