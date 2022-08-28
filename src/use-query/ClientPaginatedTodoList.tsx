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
import invariant from 'tiny-invariant'
import { get, paged } from '../core'
import { Filter, Todo } from '../todo'
import { filteredTodos, useTodoMutations } from './common'
import { Pagination } from './Pagination'

export type TodoItemProps = Readonly<{
  todo: Readonly<Todo>
  onToggle(id: Todo): void
  onDelete(id: number): void
}>

export const TodoItem = React.memo(({ todo, ...actions }: TodoItemProps) => (
  <Tr>
    <Td>{todo.title}</Td>
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
))

export type TodoListViewProps = Readonly<{
  todoList: readonly Todo[]
  onToggle(id: Todo): void
  onDelete(todo: number): void
}>

export const TodoListView = ({ todoList, ...actions }: TodoListViewProps) => (
  <Table variant="simple">
    <Thead>
      <Tr>
        <Th>Id</Th>
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
)

const useTodoList = () => {
  const limit = 10
  const [filter, setFilter] = React.useState<Filter>('All')
  const [page, setPage] = React.useState(1)

  const { data, error, isLoading } = useQuery(['todos'], get)

  const todoList = React.useMemo(
    () =>
      data === undefined
        ? undefined
        : paged(filteredTodos(data, filter), page, limit),

    [data, filter, page, limit],
  )

  const { deleteTodo, toggleTodo } = useTodoMutations()

  return {
    todoList,
    error,
    isLoading,
    total: data?.length || 0,
    page,
    onPageChange: setPage,

    filter,
    onFilterChange: React.useCallback(
      (s: string) => setFilter(s as Filter),
      [],
    ),
    onDelete: deleteTodo.mutate,
    onToggle: toggleTodo.mutate,
  } as const
}

export const TodoList = () => {
  const {
    isLoading,
    error,
    todoList,
    total,

    filter,
    page,

    ...actions
  } = useTodoList()

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  if (error) {
    return <h1>Server Error</h1>
  }

  invariant(todoList !== undefined, 'todoList is undefined')

  return (
    <Box>
      <RadioGroup onChange={actions.onFilterChange} value={filter}>
        <Stack direction="row">
          <Radio value="All">All</Radio>
          <Radio value="Completed">Completed</Radio>
          <Radio value="Incomplete">Incomplete</Radio>
        </Stack>
      </RadioGroup>

      <TodoListView
        todoList={todoList}
        onDelete={actions.onDelete}
        onToggle={actions.onToggle}
      />

      <Pagination
        current={page}
        pageCount={total}
        onPageChange={actions.onPageChange}
      />
    </Box>
  )
}
