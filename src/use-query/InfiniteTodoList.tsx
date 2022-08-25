import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import React from 'react'
import { FixedSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import axios from 'redaxios'
import { Filter, Todo } from '../todo'

// export type TodoItemProps = {
//   todo: Todo
//   onToggleTodo(id: Todo): void
//   onDeleteTodo(id: number): void
// }

// export const TodoItem = ({
//   todo,
//   onDeleteTodo,
//   onToggleTodo,
// }: TodoItemProps) => (
//   <Tr>
//   </Tr>
// )

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

// export const TodoListView = ({
//   todoList,
//   filter,
//   onFilterChange,
//   ...actions
// }: TodoListViewProps) => (
//   <Box>
//     <RadioGroup onChange={onFilterChange} value={filter}>
//       <Stack direction="row">
//         <Radio value="All">All</Radio>
//         <Radio value="Completed">Completed</Radio>
//         <Radio value="Incomplete">Incomplete</Radio>
//       </Stack>
//     </RadioGroup>
//     <Flex direction="column">
//       <Table variant="simple">
//         <Thead>
//           <Tr>
//             <Th>Title</Th>
//             <Th>Completed</Th>
//             <Th />
//           </Tr>
//         </Thead>
//         <Tbody>
//           {todoList.map(todo => (
//             <TodoItem key={todo.id} todo={todo} {...actions} />
//           ))}
//         </Tbody>
//       </Table>
//     </Flex>
//   </Box>
// )

const limit = 100

const iget = async ({ pageParam = 1 }) => {
  const res = await axios.get(`api/todos?_limit=${limit}&_page=${pageParam}`)

  const itemCount = Math.floor(Number(res.headers.get('X-Total-Count') ?? 1))

  const totalPages = (itemCount + limit) / limit

  return { data: res.data as Todo[], totalPages, itemCount }
}

export const TodoList = () => {
  // const [filter, setFilter] = React.useState<Filter>('All')
  const queryClient = useQueryClient()

  const { data, error, isLoading, hasNextPage, fetchNextPage } =
    useInfiniteQuery(['todos'], iget, {
      getNextPageParam: (page, lastPages) => {
        console.log({ page })
        return lastPages.length <= page.totalPages
          ? lastPages.length + 1
          : undefined
      },
    })

  const todoList = React.useMemo(
    () => data?.pages?.flatMap(page => page.data) as Todo[],
    [data],
  )

  const itemCount = React.useMemo(
    () => data?.pages[0].itemCount || 10,
    [data?.pages],
  )

  const invalidateTodos = {
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']).catch(err => console.error(err))
    },
  }

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

  const isItemLoaded = (index: number) =>
    !hasNextPage || index < todoList.length

  // Render an item or a loading indicator.
  const Item = ({ index, style }: any) => {
    let content
    if (index < todoList.length) {
      content = todoList[index].title
    } else {
      content = 'Loading...'
    }

    return <div style={style}>{`${index as number}: ${content}`}</div>
  }

  const loadMoreItems = () => {
    fetchNextPage().catch(err => console.error(err))
  }

  console.log({ data })
  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeList
          itemCount={todoList.length}
          onItemsRendered={onItemsRendered}
          ref={ref}
          itemSize={40}
          width={600}
          height={600}
        >
          {Item}
        </FixedSizeList>
      )}
    </InfiniteLoader>
  )
}
