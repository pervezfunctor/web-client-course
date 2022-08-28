import {
  Box,
  Checkbox,
  Flex,
  Heading,
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
import { paged } from '../core'
import { atom, useAtom, useAtomValue } from 'jotai'
import { atomWithQuery } from 'jotai/query'
import React, { Suspense, useTransition } from 'react'
import axios from 'redaxios'
import { Filter, Todo } from '../todo'
import { filteredTodos, itemCount, pageCount } from './common'
import { Pagination } from './Pagination'

const limitAtom = atom(15)
const pageAtom = atom(1)
const filterAtom = atom<Filter>('All')

const resAtom = atomWithQuery(() => {
  return {
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await axios.get(`/api/todos`)
      return { data: res.data as readonly Todo[], itemCount: itemCount(res) }
    },
  }
})

const filteredTodosAtom = atom(get =>
  filteredTodos(get(resAtom).data, get(filterAtom)),
)

const todoListAtom = atom(get =>
  paged(get(filteredTodosAtom), get(pageAtom), get(limitAtom)),
)

const pageCountAtom = atom(get =>
  pageCount(get(resAtom).itemCount, get(limitAtom)),
)

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

  return (
    <Box>
      <Flex direction="row">
        <RadioGroup
          onChange={f => {
            startTransition(() => {
              setFilter(f as Filter)
            })
          }}
          value={filter}
        >
          <Stack direction="row">
            <Radio value="All">All</Radio>
            <Radio value="Completed">Completed</Radio>
            <Radio value="Incomplete">Incomplete</Radio>
          </Stack>
        </RadioGroup>
        {isPending && <Spinner />}
      </Flex>

      <Suspense fallback={<Heading>Loading...</Heading>}>
        <TodoListView />
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
