import { Box, Flex, Spinner } from '@chakra-ui/react'
import { atom, useAtom, useAtomValue } from 'jotai'
import { atomWithQuery } from 'jotai/query'
import { stringify } from 'query-string'
import React, { Suspense, useTransition } from 'react'
import axios from 'redaxios'
import { Filter, Todo } from '../todo'
import { itemCount, pageCount } from './common'
import { FilterView, Pagination, TodoListView } from './components'

const limitAtom = atom(15)
const pageAtom = atom(1)
const filterAtom = atom<Filter>('All')

const resAtom = atomWithQuery(get => ({
  queryKey: ['todos', get(pageAtom), get(limitAtom), get(filterAtom)],

  queryFn: async ({ queryKey: [, page, limit, filter] }) => {
    const q = stringify({
      _limit: limit,
      _page: page,
      completed:
        filter === 'All' ? undefined : filter === 'Completed' ? true : false,
    })

    const res = await axios.get(`api/todos?${q}`)
    const data = res.data as readonly Todo[]

    const ic = itemCount(res)
    const pc = pageCount(ic, Number(limit))

    return { data, itemCount: ic, pageCount: pc }
  },
}))

const todoListAtom = atom(get => get(resAtom).data)

const pageCountAtom = atom(get => get(resAtom).pageCount)

export const TodoListComp = () => {
  const todoList = useAtomValue(todoListAtom)
  return <TodoListView todoList={todoList} />
}

export const TodoList = () => {
  const [isPending, startTransition] = useTransition()

  const pageCount = useAtomValue(pageCountAtom)
  const [page, setPage] = useAtom(pageAtom)
  const [filter, setFilter] = useAtom(filterAtom)

  React.useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount)
    }
  }, [pageCount])

  const handleFilterChange = React.useCallback((filter: Filter) => {
    startTransition(() => {
      setFilter(filter)
    })
  }, [])

  const handlePageChange = React.useCallback((page: number) => {
    startTransition(() => setPage(page))
  }, [])

  return (
    <Flex direction="column" h="100vh" p="5">
      <Flex direction="row">
        <FilterView filter={filter} onFilterChange={handleFilterChange} />
        {isPending && <Spinner />}
      </Flex>

      <Box flexGrow={1}>
        <Suspense fallback={<h1>Loading...</h1>}>
          <TodoListComp />
        </Suspense>
      </Box>
      <Pagination
        current={page}
        pageCount={pageCount}
        onPageChange={handlePageChange}
      />
    </Flex>
  )
}
