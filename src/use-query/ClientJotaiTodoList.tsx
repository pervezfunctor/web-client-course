import { Box, Flex, Heading, Spinner } from '@chakra-ui/react'
import { atom, useAtom, useAtomValue } from 'jotai'
import { atomWithQuery } from 'jotai/query'
import React, { Suspense, useTransition } from 'react'
import axios from 'redaxios'
import { paged } from '../core'
import { Filter, Todo } from '../todo'
import { filteredTodos, pageCount } from './common'
import { FilterView, Pagination, TodoListView } from './components'

const limitAtom = atom(15)
const pageAtom = atom(1)
const filterAtom = atom<Filter>('All')

const todosAtom = atomWithQuery(() => {
  return {
    queryKey: ['todos'],
    queryFn: async () =>
      (await axios.get(`/api/todos`)).data as readonly Todo[],
  }
})

const filteredTodosAtom = atom(get =>
  filteredTodos(get(todosAtom), get(filterAtom)),
)

const todoListAtom = atom(get =>
  paged(get(filteredTodosAtom), get(pageAtom), get(limitAtom)),
)

const pageCountAtom = atom(get =>
  pageCount(get(filteredTodosAtom).length, get(limitAtom)),
)

const TodoListComp = () => {
  const todoList = useAtomValue(todoListAtom)

  return <TodoListView todoList={todoList} />
}

export const TodoList = () => {
  const [isPending, startTransition] = useTransition()

  const pageCount = useAtomValue(pageCountAtom)
  const [page, setPage] = useAtom(pageAtom)
  const [filter, setFilter] = useAtom(filterAtom)

  return (
    <Box>
      <Flex direction="row">
        <FilterView filter={filter} onFilterChange={setFilter} />
        {isPending && <Spinner />}
      </Flex>

      <Suspense fallback={<Heading>Loading...</Heading>}>
        <TodoListComp />
      </Suspense>

      <Pagination
        current={page}
        pageCount={pageCount}
        onPageChange={page => {
          startTransition(() => setPage(page))
        }}
      />
    </Box>
  )
}
