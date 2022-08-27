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
import {
  QueryFunctionContext,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import React from 'react'
import axios from 'redaxios'
import { Filter, Todo } from '../todo'

export type TodoItemProps = Readonly<{
  todo: Readonly<Todo>
  onToggleTodo(id: Todo): void
  onDeleteTodo(id: number): void
}>

export const TodoItem = ({
  todo,
  onDeleteTodo,
  onToggleTodo,
}: TodoItemProps) => (
  <Tr>
    <Td>{todo.title}</Td>
    <Td>
      <Checkbox
        isChecked={todo.completed}
        onChange={() => onToggleTodo(todo)}
      />
    </Td>
    <Td>
      <ButtonGroup>
        <Button>Edit</Button>
        <Button onClick={() => onDeleteTodo(todo.id)}>Delete</Button>
      </ButtonGroup>
    </Td>
  </Tr>
)

const del = async (todoId: number) =>
  (await axios.delete(`/api/todos/${todoId}`)).data

const toggle = async (todo: Todo) =>
  (
    await axios.patch(`/api/todos/${todo.id}`, {
      ...todo,
      completed: !todo.completed,
    })
  ).data

export type TodoListViewProps = Readonly<{
  todoList: readonly Todo[]
  filter: Filter
  onFilterChange(filter: Filter): void
  onToggleTodo(id: Todo): void
  onDeleteTodo(todo: number): void
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

// const getPage = (res: Response<any>, rel: string) => {
//   const link = res.headers
//     .get('Link')
//     ?.split(', ')
//     .find(h => h.includes(`rel="${rel}"`))
//     ?.split('; ')[0]
//     .slice(1, -1)

//   return link && Number(link?.slice(link?.lastIndexOf('_page=') + 6))
// }

const limit = 10

const iget = async ({ queryKey }: QueryFunctionContext<[string, number]>) => {
  const res = await axios.get(`api/todos?_limit=${limit}&_page=${queryKey[1]}`)

  const totalPages = Math.floor(
    (Number(res.headers.get('X-Total-Count') ?? 1) + limit - 1) / limit,
  )

  return { page: res.data, totalPages }
}

export const TodoList = () => {
  const queryClient = useQueryClient()
  const [filter, setFilter] = React.useState<Filter>('All')
  const [page, setPage] = React.useState(1)

  const { data, error, isLoading, isPreviousData } = useQuery(
    ['todos', page],
    iget,
    { keepPreviousData: true },
  )

  const todoList = React.useMemo(
    () =>
      (data?.page as Todo[])?.filter(
        t =>
          filter === 'All' ||
          (filter === 'Completed' ? t.completed : !t.completed),
      ),
    [data, filter],
  )

  const invalidateTodos = React.useMemo(
    () => ({
      onSuccess: () => {
        queryClient
          .invalidateQueries(['todos'])
          .catch(err => console.error(err))
      },
    }),
    [queryClient],
  )

  const deleteTodo = useMutation(del, invalidateTodos)
  const toggleTodo = useMutation(toggle, invalidateTodos)

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  if (error) {
    return <h1>Server Error</h1>
  }

  if (deleteTodo.error || toggleTodo.error) {
    console.error({
      deleteError: deleteTodo.error,
      toggleTodoError: toggleTodo.error,
    })
  }

  const totalPages = data?.totalPages || 1

  return (
    <Box>
      <TodoListView
        filter={filter}
        onFilterChange={setFilter}
        todoList={todoList}
        onDeleteTodo={deleteTodo.mutate}
        onToggleTodo={toggleTodo.mutate}
      />

      <ButtonGroup>
        <Button
          disabled={isPreviousData || page <= 1}
          onClick={() => setPage(page => Math.max(page - 1, 1))}
        >
          Previous
        </Button>
        <Button
          disabled={isPreviousData || page >= totalPages}
          onClick={() => setPage(page => Math.min(page + 1, totalPages || 1))}
        >
          Next
        </Button>
      </ButtonGroup>
    </Box>
  )
}
