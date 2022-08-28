import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  Heading,
  HStack,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { FixedSizeList } from 'react-window'
import invariant from 'tiny-invariant'
import { get } from '../core'
import { Filter, Todo } from '../todo'
import { del, filteredTodos, toggle } from './common'

export type TodoItemProps = Readonly<{
  todo: Readonly<Todo>
  onToggle(id: Todo): void
  onDelete(id: number): void
}>

export const TodoItem = React.memo(({ todo, ...actions }: TodoItemProps) => (
  <HStack p={1}>
    <Checkbox
      isChecked={todo.completed}
      onChange={() => actions.onToggle(todo)}
    />
    <Text>{todo.id}</Text>
    <Text p="2">{todo.title}</Text>
    <Spacer />

    <ButtonGroup>
      <Button>Edit</Button>
      <Button onClick={() => actions.onDelete(todo.id)}>Delete</Button>
    </ButtonGroup>
  </HStack>
))

export type TodoListViewProps = Readonly<{
  todoList: readonly Todo[]
  total: number
  onToggle(id: Todo): void
  onDelete(todo: number): void
}>

export const TodoListView = ({
  todoList,
  total,
  ...actions
}: TodoListViewProps) => {
  const Item = ({ index, style }: any) => (
    <span style={style}>
      <TodoItem key={todoList[index].id} todo={todoList[index]} {...actions} />
    </span>
  )

  return (
    <Flex p="5">
      <FixedSizeList itemCount={total} itemSize={40} width={600} height={1000}>
        {Item}
      </FixedSizeList>
    </Flex>
  )
}

const useTodoList = () => {
  const [filter, setFilter] = React.useState<Filter>('All')

  const queryClient = useQueryClient()
  const { data, error, isLoading } = useQuery(['todos'], get)

  const invalidateTodos = {
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']).catch(err => console.error(err))
    },
  }

  const deleteTodo = useMutation(del, invalidateTodos)
  const toggleTodo = useMutation(toggle, invalidateTodos)

  const todoList = React.useMemo(
    () => (data === undefined ? undefined : filteredTodos(data, filter)),
    [data, filter],
  )

  if (deleteTodo.error || toggleTodo.error) {
    console.error({
      deleteError: deleteTodo.error,
      toggleTodoError: toggleTodo.error,
    })
  }

  return {
    total: data?.length || 0,
    todoList,
    error,
    isLoading,

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

    ...actions
  } = useTodoList()

  if (isLoading) {
    return <Heading>Loading...</Heading>
  }

  if (error) {
    return <Heading color="red">Server Error</Heading>
  }

  invariant(todoList !== undefined, 'todoList is undefined')

  return (
    <Box p="10">
      <RadioGroup onChange={actions.onFilterChange} value={filter} p="5">
        <Stack direction="row">
          <Radio value="All">All</Radio>
          <Radio value="Completed">Completed</Radio>
          <Radio value="Incomplete">Incomplete</Radio>
        </Stack>
      </RadioGroup>

      <TodoListView
        todoList={todoList}
        total={total}
        onDelete={actions.onDelete}
        onToggle={actions.onToggle}
      />
    </Box>
  )
}
