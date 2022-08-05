import {
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import React from 'react'
import { Todo } from '../todo'

export type TodoItemProps = Readonly<{
  todo: Todo
  onToggle(id: number): void
  onDelete(id: number): void
}>

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => (
  <Tr>
    <Td>{todo.title}</Td>
    <Td>
      <Checkbox isChecked={todo.completed} onChange={() => onToggle(todo.id)} />
    </Td>
    <Td>
      <ButtonGroup>
        <Button>Edit</Button>
        <Button onClick={() => onDelete(todo.id)}>Delete</Button>
      </ButtonGroup>
    </Td>
  </Tr>
)

export type TodoListProps = Readonly<{
  todoList: readonly Todo[]
  onToggle(id: number): void
  onDelete(id: number): void
}>

export const TodoList = ({ todoList, onToggle, onDelete }: TodoListProps) => (
  <Flex direction="column">
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Title</Th>
          <Th>Completed</Th>
          <Th />
        </Tr>
      </Thead>
      <Tbody>
        {todoList.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </Tbody>
    </Table>
  </Flex>
)
