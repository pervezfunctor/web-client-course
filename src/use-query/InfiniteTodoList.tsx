import { useInfiniteQuery } from '@tanstack/react-query'
import React from 'react'
import { FixedSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import axios from 'redaxios'
import { Todo } from '../todo'

const limit = 100

const iget = async ({ pageParam = 1 }) => {
  const res = await axios.get(`api/todos?_limit=${limit}&_page=${pageParam}`)

  const itemCount = Math.floor(Number(res.headers.get('X-Total-Count') ?? 1))
  const totalPages = (itemCount + limit - 1) / limit

  return { data: res.data as Todo[], totalPages, itemCount }
}

export const TodoList = () => {
  const {
    data,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(['todos'], iget, {
    getNextPageParam: (page, lastPages) =>
      lastPages.length <= page.totalPages ? lastPages.length + 1 : undefined,
  })

  const todoList = React.useMemo(
    () => data?.pages?.flatMap(page => page.data),
    [data],
  )

  const itemCount = React.useMemo(
    () => data?.pages[0].itemCount || 10,
    [data?.pages],
  )

  const Item = React.useMemo(
    () =>
      ({ index, style }: any) =>
        todoList === undefined ? null : index < todoList.length ? (
          <div style={style}>
            {`${index as number}: ${todoList[index].title}`}
          </div>
        ) : (
          <div style={style}>loading...</div>
        ),
    [todoList],
  )

  const loadMoreItems = React.useCallback(() => {
    if (isFetchingNextPage) {
      return
    }

    fetchNextPage().catch(err => console.error(err))
  }, [fetchNextPage, isFetchingNextPage])

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  if (error) {
    return <h1>Server Error</h1>
  }

  if (todoList === undefined) {
    return null
  }

  const isItemLoaded = (index: number) =>
    !hasNextPage || index < todoList.length

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      threshold={limit}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeList
          itemCount={itemCount}
          onItemsRendered={onItemsRendered}
          ref={ref}
          itemSize={40}
          width={600}
          height={800}
        >
          {Item}
        </FixedSizeList>
      )}
    </InfiniteLoader>
  )
}
