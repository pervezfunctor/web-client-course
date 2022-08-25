import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
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
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import React from 'react'
import axios from 'redaxios'
import { useInfiniteLoader } from '../core'
import { Filter, Todo } from '../todo'

export type TodoItemProps = {
  todo: Todo
  onToggleTodo(id: Todo): void
  onDeleteTodo(id: number): void
}

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

export type TodoListViewProps = {
  todoList: readonly Todo[]
  onToggleTodo(id: Todo): void
  onDeleteTodo(todo: number): void
  filter: Filter
  onFilterChange(filter: Filter): void
}

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
            <TodoItem key={todo.id} todo={todo} {...actions} />
          ))}
        </Tbody>
      </Table>
    </Flex>
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

const limit = 5

const iget = async ({ pageParam = 1 }) => {
  const res = await axios.get(`api/todos?_limit=${limit}&_page=${pageParam}`)

  const totalPages = Math.floor(
    (Number(res.headers.get('X-Total-Count') ?? 1) + limit) / limit,
  )

  return { data: res.data, totalPages }
}

export const TodoList = () => {
  const [filter, setFilter] = React.useState<Filter>('All')
  const queryClient = useQueryClient()
  const ref = React.useRef<HTMLDivElement>(null)

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(['todos'], iget, {
    getNextPageParam: (page, lastPages) => {
      return lastPages.length <= page.totalPages
        ? lastPages.length + 1
        : undefined
    },
  })

  const todoList = React.useMemo(
    () =>
      (data?.pages?.flatMap(page => page.data) as Todo[])?.filter(
        t =>
          filter === 'All' ||
          (filter === 'Completed' ? t.completed : !t.completed),
      ),
    [data, filter],
  )

  const invalidateTodos = {
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']).catch(err => console.error(err))
    },
  }

  const deleteTodo = useMutation(del, invalidateTodos)
  const toggleTodo = useMutation(toggle, invalidateTodos)

  useInfiniteLoader(
    ref,
    React.useCallback(() => {
      fetchNextPage().catch(err => console.error(err))
    }, [fetchNextPage]),
  )

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

  console.log(todoList.length)
  return (
    <>
      {/* <pre>{JSON.stringify({ length: todoList.length }, null, 2)}</pre> */}
      <TodoListView
        filter={filter}
        onFilterChange={setFilter}
        todoList={todoList}
        onDeleteTodo={id => deleteTodo.mutate(id)}
        onToggleTodo={todo => toggleTodo.mutate(todo)}
      />
      {hasNextPage && (
        <div ref={ref}>
          <Button
            disabled={isFetchingNextPage}
            onClick={() => {
              fetchNextPage().catch(err => console.error(err))
            }}
          >
            Load More
          </Button>
        </div>
      )}
    </>
  )
}
