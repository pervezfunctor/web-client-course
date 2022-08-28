import { Box, Heading, Radio, RadioGroup, Stack } from '@chakra-ui/react'
import React from 'react'
import invariant from 'tiny-invariant'
import { Filter } from '../todo'
import { filteredTodos, useTodoMutations, useTodos } from './common'
import { VirtualTodoListView } from './components/VirtualTodoListView'

const useTodoList = () => {
  const [filter, setFilter] = React.useState<Filter>('All')

  const { data, error, isLoading } = useTodos()

  const todoList = React.useMemo(
    () => (data === undefined ? undefined : filteredTodos(data, filter)),
    [data, filter],
  )

  const { deleteTodo, toggleTodo } = useTodoMutations()

  return {
    itemCount: todoList?.length || 0,
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
    itemCount,

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

      <VirtualTodoListView
        todoList={todoList}
        itemCount={itemCount}
        onDelete={actions.onDelete}
        onToggle={actions.onToggle}
      />
    </Box>
  )
}
