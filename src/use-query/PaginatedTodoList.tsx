import { Box, Spinner } from '@chakra-ui/react'
import React from 'react'
import { Filter } from '../todo'
import { filteredTodos, usePagedTodos, useTodoMutations } from './common'
import { FilterView, Pagination, TodoListView } from './components'

export const TodoList = () => {
  const [filter, setFilter] = React.useState<Filter>('All')
  const [page, setPage] = React.useState(1)

  const { data, error, isLoading, isPreviousData } = usePagedTodos(page)

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

  return (
    <Box>
      <FilterView filter={filter} onFilterChange={setFilter} />
      <TodoListView
        todoList={todoList}
        onDelete={deleteTodo.mutate}
        onToggle={toggleTodo.mutate}
      />
      {isPreviousData && <Spinner />}
      <Pagination
        current={page}
        pageCount={todoList.length}
        onPageChange={setPage}
      />
    </Box>
  )
}
