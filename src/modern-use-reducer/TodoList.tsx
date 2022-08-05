import {
  Button,
  ButtonGroup,
  Checkbox,
  Divider,
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
import { actions, useAction, useSelect } from './state'
import { TodoForm } from './TodoForm'

export type TodoItemProps = Readonly<{
  todo: Todo
}>

export const TodoItem = React.memo(({ todo }: TodoItemProps) => {
  const onDelete = useAction(() => actions.deleteTodo(todo.id))
  const onToggle = useAction(() => actions.toggleTodo(todo.id))

  return (
    <Tr>
      <Td>{todo.title}</Td>
      <Td>
        <Checkbox isChecked={todo.completed} onChange={onToggle} />
      </Td>
      <Td>
        <ButtonGroup>
          <Button>Edit</Button>
          <Button onClick={onDelete}>Delete</Button>
        </ButtonGroup>
      </Td>
    </Tr>
  )
})

export const TodoList = () => {
  const [show, set] = React.useState(false)
  const todoList = useSelect(snap => Array.from(snap.values()))

  return (
    <Flex direction="column">
      {show ? (
        <TodoForm />
      ) : (
        <Button alignSelf="flex-end" m="20px" onClick={() => set(!show)}>
          Add
        </Button>
      )}

      <Divider orientation="horizontal" />

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
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </Tbody>
      </Table>
    </Flex>
  )
}
