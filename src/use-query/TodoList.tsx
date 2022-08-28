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
import React from 'react'
import { useInfiniteLoader } from '../core'
import { Filter, Todo } from '../todo'
import { filteredTodos, useInfiniteTodos, useTodoMutations } from './common'

export type TodoItemProps = Readonly<{
  todo: Todo
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

export type TodoListViewProps = {
  todoList: readonly Todo[]
  onToggle(id: Todo): void
  onDelete(todo: number): void
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

export const TodoList = () => {
  const [filter, setFilter] = React.useState<Filter>('All')
  const ref = React.useRef<HTMLDivElement>(null)

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteTodos()

  const todoList = React.useMemo(
    () =>
      filteredTodos(data?.pages?.flatMap(page => page.data) as Todo[], filter),
    [data, filter],
  )

  useInfiniteLoader(
    ref,
    React.useCallback(() => {
      fetchNextPage().catch(err => console.error(err))
    }, [fetchNextPage]),
  )

  const { deleteTodo, toggleTodo } = useTodoMutations()

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  if (error) {
    return <h1>Server Error</h1>
  }

  return (
    <Box>
      <TodoListView
        filter={filter}
        onFilterChange={setFilter}
        todoList={todoList}
        onDelete={id => deleteTodo.mutate(id)}
        onToggle={todo => toggleTodo.mutate(todo)}
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
    </Box>
  )
}
