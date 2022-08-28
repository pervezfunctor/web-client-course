import {
  Box,
  Checkbox,
  Flex,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { atom, useAtom, useAtomValue } from 'jotai'
import { atomWithQuery } from 'jotai/query'
import { stringify } from 'query-string'
import React, { Suspense, useTransition } from 'react'
import axios from 'redaxios'
import { Filter, Todo } from '../todo'
import { itemCount, pageCount } from './common'
import { Pagination } from './Pagination'

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
    return { data, itemCount: ic, pageCount: pageCount(ic, Number(limit)) }
  },
}))

const todoListAtom = atom(get => get(resAtom).data)
const pageCountAtom = atom(get => get(resAtom).pageCount)

export const TodoItem = React.memo(({ todo }: { todo: Todo }) => (
  <Tr>
    <Td>{todo.id}</Td>
    <Td>{todo.title}</Td>
    <Td>
      <Checkbox isChecked={todo.completed} />
    </Td>
  </Tr>
))

export const TodoListView = () => {
  const todoList = useAtomValue(todoListAtom)

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Id</Th>
          <Th>Title</Th>
          <Th>Completed</Th>
        </Tr>
      </Thead>

      <Tbody>
        {todoList.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </Tbody>
    </Table>
  )
}

export const TodoList = () => {
  const [isPending, startTransition] = useTransition()

  const pageCount = useAtomValue(pageCountAtom)
  const [page, setPage] = useAtom(pageAtom)
  const [filter, setFilter] = useAtom(filterAtom)

  const handleFilterChange = React.useCallback((filter: string) => {
    startTransition(() => {
      setFilter(filter as Filter)
    })
  }, [])

  const handlePageChange = React.useCallback((page: number) => {
    startTransition(() => setPage(page))
  }, [])

  return (
    <Box>
      <Flex direction="row">
        <RadioGroup onChange={handleFilterChange} value={filter}>
          <Stack direction="row">
            <Radio value="All">All</Radio>
            <Radio value="Completed">Completed</Radio>
            <Radio value="Incomplete">Incomplete</Radio>
          </Stack>
        </RadioGroup>
        {isPending && <Spinner />}
      </Flex>

      <Suspense fallback={<h1>Loading...</h1>}>
        <TodoListView />
      </Suspense>

      <Pagination
        current={page}
        pageCount={pageCount}
        onPageChange={handlePageChange}
      />
    </Box>
  )
}
