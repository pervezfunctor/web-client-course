import {
  Button,
  ButtonGroup,
  Checkbox,
  Divider,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import React from 'react'
import { Filter, Todo } from '../todo'
import { filteredTodosSelector, filterSelector } from './selectors'
import { actions, useAction, useSelect } from './state'
import { TodoForm } from './TodoForm'

export type TodoItemProps = Readonly<Todo>

export const TodoItem = React.memo(
  ({ completed, id, title }: TodoItemProps) => {
    const onDelete = useAction(() => actions.deleteTodo(id))
    const onToggle = useAction(() => actions.toggleTodo(id))

    console.count('todo-item: ')

    return (
      <Tr>
        <Td>{title}</Td>
        <Td>
          <Checkbox isChecked={completed} onChange={onToggle} />
        </Td>
        <Td>
          <ButtonGroup>
            <Button>Edit</Button>
            <Button onClick={onDelete}>Delete</Button>
          </ButtonGroup>
        </Td>
      </Tr>
    )
  },
)

export const TodoList = () => {
  const [show, set] = React.useState(false)
  const filter = useSelect(filterSelector)
  const filtered = useSelect(filteredTodosSelector)

  const setFilter = useAction(actions.setFilter)

  return (
    <>
      <RadioGroup onChange={evt => setFilter(evt as Filter)} value={filter}>
        <Stack direction="row">
          <Radio value="All">All</Radio>
          <Radio value="Completed">Completed</Radio>
          <Radio value="Incomplete">Incomplete</Radio>
        </Stack>
      </RadioGroup>
      <Divider orientation="horizontal" />

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
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map(todo => (
              <TodoItem key={todo.id} {...todo} />
            ))}
          </Tbody>
        </Table>
      </Flex>
    </>
  )
}
