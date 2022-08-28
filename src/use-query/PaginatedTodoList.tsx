import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
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
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Filter, Todo } from '../todo'
import { filteredTodos, getPagedTodos, useTodoMutations } from './common'

export type TodoItemProps = Readonly<{
  todo: Readonly<Todo>
  onToggle(id: Todo): void
  onDelete(id: number): void
}>

export const TodoItem = ({ todo, ...actions }: TodoItemProps) => (
  <Tr>
    <Td>{todo.title}</Td>
    <Td>
      <Checkbox
        isChecked={todo.completed}
        onChange={() => actions.onToggle(todo)}
      />
    </Td>
    <Td>
      <ButtonGroup>
        <Button>Edit</Button>
        <Button onClick={() => actions.onDelete(todo.id)}>Delete</Button>
      </ButtonGroup>
    </Td>
  </Tr>
)

export type TodoListViewProps = Readonly<{
  todoList: readonly Todo[]
  filter: Filter
  onFilterChange(filter: Filter): void
  onToggle(id: Todo): void
  onDelete(todo: number): void
}>

export const TodoListView = ({
  todoList,
  filter,
  onFilterChange,
  ...actions
}: TodoListViewProps) => (
  <Box>
    <RadioGroup onChange={onFilterChange} value={filter}>
      <Stack direction="row">
        <Radio value="All">All</Radio>
        <Radio value="Completed">Completed</Radio>
        <Radio value="Incomplete">Incomplete</Radio>
      </Stack>
    </RadioGroup>

    <Table variant="simple" width="full">
      <Thead>
        <Tr>
          <Th>Title</Th>
          <Th>Completed</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {todoList.map(todo => (
          <TodoItem key={todo.id} todo={todo} {...actions} />
        ))}
      </Tbody>
    </Table>
  </Box>
)

export const TodoList = () => {
  const [filter, setFilter] = React.useState<Filter>('All')
  const [page, setPage] = React.useState(1)

  const { data, error, isLoading, isPreviousData } = useQuery(
    ['todos', page],
    getPagedTodos,
    { keepPreviousData: true },
  )

  const todoList = React.useMemo(
    () => filteredTodos(data?.page || [], filter),
    [data, filter],
  )

  const { deleteTodo, toggleTodo } = useTodoMutations()

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  if (error) {
    return <h1>Server Error</h1>
  }

  const pageCount = data?.pageCount || 1

  return (
    <Box>
      <TodoListView
        filter={filter}
        onFilterChange={setFilter}
        todoList={todoList}
        onDelete={deleteTodo.mutate}
        onToggle={toggleTodo.mutate}
      />

      <ButtonGroup>
        <Button
          disabled={isPreviousData || page <= 1}
          onClick={() => setPage(page => Math.max(page - 1, 1))}
        >
          Previous
        </Button>
        <Button
          disabled={isPreviousData || page >= pageCount}
          onClick={() => setPage(page => Math.min(page + 1, pageCount || 1))}
        >
          Next
        </Button>
      </ButtonGroup>
    </Box>
  )
}
