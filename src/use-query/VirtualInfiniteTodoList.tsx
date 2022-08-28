import React from 'react'
import { FixedSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import invariant from 'tiny-invariant'
import { useInfiniteTodos } from './common'

const useTodoList = () => {
  const {
    data,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteTodos()

  const todoList = React.useMemo(
    () => data?.pages?.flatMap(page => page.data),
    [data],
  )

  const itemCount = React.useMemo(
    () => data?.pages[0].itemCount || 10,
    [data?.pages],
  )
  const loadMoreItems = React.useCallback(() => {
    if (isFetchingNextPage) {
      return
    }

    fetchNextPage().catch(err => console.error(err))
  }, [fetchNextPage, isFetchingNextPage])

  const isItemLoaded = (index: number) =>
    !hasNextPage || index < (todoList?.length || 0)

  return {
    todoList,
    isLoading,
    error,
    hasNextPage,
    itemCount,
    loadMoreItems,
    isItemLoaded,
  }
}

export const TodoList = () => {
  const { isLoading, todoList, error, isItemLoaded, itemCount, loadMoreItems } =
    useTodoList()

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

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  if (error) {
    return <h1>Server Error</h1>
  }

  invariant(todoList !== undefined, 'todolist is undefined')

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
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
