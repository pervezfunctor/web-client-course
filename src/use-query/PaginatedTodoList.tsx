import { Box, Spinner } from '@chakra-ui/react'
import React from 'react'
import invariant from 'tiny-invariant'
import { usePagedTodos, useTodoMutations } from './common'
import { Pagination, TodoListView } from './components'

export const TodoList = () => {
  const [page, setPage] = React.useState(1)

  const { data, error, isLoading, isPreviousData } = usePagedTodos(page)

  const { deleteTodo, toggleTodo } = useTodoMutations()

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  if (error) {
    return <h1>Server Error</h1>
  }

  invariant(data !== undefined)

  return (
    <Box>
      <TodoListView
        todoList={data.page}
        onDelete={deleteTodo.mutate}
        onToggle={toggleTodo.mutate}
      />
      <Pagination
        current={page}
        pageCount={data.pageCount}
        onPageChange={setPage}
      />
      {isPreviousData && <Spinner />}
    </Box>
  )
}
