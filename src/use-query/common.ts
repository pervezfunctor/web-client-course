import {
  QueryFunctionContext,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { stringify } from 'query-string'
import React from 'react'
import axios, { Response } from 'redaxios'
import { get } from '../core'
import { Filter, Todo } from '../todo'

export const limit = 15

export const itemCount = (res: Response<any>) =>
  Math.floor(Number(res.headers.get('X-Total-Count') ?? 1))

export const pageCount = (itemCount: number, limit: number) =>
  Math.floor((itemCount + limit - 1) / limit)

export const filteredTodos = (todoList: readonly Todo[], filter: Filter) =>
  todoList.filter(
    t =>
      filter === 'All' || (filter === 'Completed' ? t.completed : !t.completed),
  )

export const del = async (todoId: number) =>
  (await axios.delete(`/api/todos/${todoId}`)).data

export const toggle = async (todo: Todo) =>
  (
    await axios.patch(`/api/todos/${todo.id}`, {
      ...todo,
      completed: !todo.completed,
    })
  ).data

const useInvalidateTodos = () => {
  const queryClient = useQueryClient()

  return React.useMemo(
    () => ({
      onSuccess: () => {
        queryClient
          .invalidateQueries(['todos'])
          .catch(err => console.error(err))
      },
    }),
    [queryClient],
  )
}

export const useTodoMutations = () => {
  const invalidateTodos = useInvalidateTodos()
  const deleteTodo = useMutation(del, invalidateTodos)
  const toggleTodo = useMutation(toggle, invalidateTodos)

  if (deleteTodo.error || toggleTodo.error) {
    console.error({
      deleteError: deleteTodo.error,
      toggleTodoError: toggleTodo.error,
    })
  }

  return { deleteTodo, toggleTodo }
}

export const getPagedTodos = async ({
  queryKey,
}: QueryFunctionContext<[string, number, number?]>) => {
  const q = stringify({ _page: queryKey[1], _limit: queryKey[2] || limit })

  const res = await axios.get(`api/todos?${q}`)

  const ic = itemCount(res)
  console.log({ ic })
  return {
    page: res.data as Todo[],
    pageCount: pageCount(ic, limit),
    itemCount: ic,
  }
}

const getInfiniteTodos = async ({ pageParam = 1 }) => {
  const q = stringify({ _limit: limit, _page: pageParam })
  const res = await axios.get(`api/todos?${q}`)

  const ic = itemCount(res)
  return {
    data: res.data,
    itemCount: ic,
    pageCount: pageCount(ic, limit),
  }
}

export const useInfiniteTodos = () =>
  useInfiniteQuery(['todos'], getInfiniteTodos, {
    getNextPageParam: (page, lastPages) =>
      lastPages.length <= page.pageCount ? lastPages.length + 1 : undefined,
  })

export const usePagedTodos = (page: number) =>
  useQuery(['todos', page], getPagedTodos, { keepPreviousData: true })

export const useTodos = () => useQuery(['todos'], get)

export const getPagefromLink = (res: Response<any>, rel: string) => {
  const link = res.headers
    .get('Link')
    ?.split(', ')
    .find(h => h.includes(`rel="${rel}"`))
    ?.split('; ')[0]
    .slice(1, -1)

  return link && Number(link?.slice(link?.lastIndexOf('_page=') + 6))
}
