import {
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  HStack,
  Spacer,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import { FixedSizeList } from 'react-window'
import { Todo } from '../../todo'

export type VirtualTodoItemProps = Readonly<{
  todo: Readonly<Todo>
  onToggle?(id: Todo): void
  onDelete?(id: number): void
}>

const VirtualTodoItem = React.memo(
  ({ todo, ...actions }: VirtualTodoItemProps) => (
    <HStack p={1}>
      <Checkbox
        isChecked={todo.completed}
        onChange={() => actions.onToggle?.(todo)}
      />
      <Text>{todo.id}</Text>
      <Text p="2">{todo.title}</Text>
      <Spacer />

      {actions.onDelete && (
        <ButtonGroup>
          <Button>Edit</Button>
          <Button onClick={() => actions.onDelete?.(todo.id)}>Delete</Button>
        </ButtonGroup>
      )}
    </HStack>
  ),
)

export type VirtualTodoListViewProps = Readonly<{
  todoList: readonly Todo[]
  itemCount: number
  onToggle?(id: Todo): void
  onDelete?(todo: number): void
}>

export const VirtualTodoListView = ({
  todoList,
  itemCount,
  ...actions
}: VirtualTodoListViewProps) => {
  const Item = ({ index, style }: any) => (
    <span style={style}>
      <VirtualTodoItem
        key={todoList[index].id}
        todo={todoList[index]}
        {...actions}
      />
    </span>
  )

  return (
    <Flex p="5">
      <FixedSizeList
        itemCount={itemCount}
        itemSize={40}
        width={600}
        height={1000}
      >
        {Item}
      </FixedSizeList>
    </Flex>
  )
}
