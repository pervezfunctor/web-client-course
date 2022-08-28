import { Checkbox, Flex, HStack, Text } from '@chakra-ui/react'
import React from 'react'
import { FixedSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import invariant from 'tiny-invariant'
import { useInfiniteTodos } from './common'
import AutoSizer from 'react-virtualized-auto-sizer'

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

const TodoItem = ({ data: todoList, index, style }: any) =>
  todoList === undefined ? null : index < todoList.length ? (
    <div style={style}>
      <HStack p={1}>
        <Checkbox isChecked={todoList[index].completed} />
        <Text>{todoList[index].id}</Text>
        <Text p="2">{todoList[index].title}</Text>
      </HStack>
    </div>
  ) : (
    <div style={style}>loading...</div>
  )

export const TodoList = () => {
  const { isLoading, todoList, error, isItemLoaded, itemCount, loadMoreItems } =
    useTodoList()

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  if (error) {
    return <h1>Server Error</h1>
  }

  invariant(todoList !== undefined, 'todolist is undefined')

  return (
    <Flex w="100%" h="100vh">
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList
                itemData={todoList}
                itemCount={itemCount}
                onItemsRendered={onItemsRendered}
                ref={ref}
                itemSize={40}
                width={width}
                height={height}
              >
                {TodoItem}
              </FixedSizeList>
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    </Flex>
  )
}
