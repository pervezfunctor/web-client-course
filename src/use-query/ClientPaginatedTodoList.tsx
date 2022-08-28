import { Box } from '@chakra-ui/react'
import React from 'react'
import invariant from 'tiny-invariant'
import { paged } from '../core'
import { Filter } from '../todo'
import { filteredTodos, pageCount, useTodoMutations, useTodos } from './common'
import { FilterView, Pagination, TodoListView } from './components'

const useTodoList = () => {
  const [limit] = React.useState(15)
  const [filter, setFilter] = React.useState<Filter>('All')
  const [page, setPage] = React.useState(1)

  const { data, error, isLoading } = useTodos()

  const filtered = React.useMemo(
    () => (data === undefined ? undefined : filteredTodos(data, filter)),

    [data, filter],
  )

  const todoList = React.useMemo(
    () => (filtered === undefined ? undefined : paged(filtered, page, limit)),
    [filtered, page, limit],
  )

  const { deleteTodo, toggleTodo } = useTodoMutations()

  return {
    todoList,
    error,
    isLoading,
    pageCount: pageCount(filtered?.length || 0, limit),
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
    pageCount,

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
      <FilterView filter={filter} onFilterChange={actions.onFilterChange} />

      <TodoListView
        todoList={todoList}
        onDelete={actions.onDelete}
        onToggle={actions.onToggle}
      />

      <Pagination
        current={page}
        pageCount={pageCount}
        onPageChange={actions.onPageChange}
      />
    </Box>
  )
}
