
/* eslint-disable react/jsx-no-bind */
import {
  Button,
  ButtonGroup,
  Checkbox,
  Divider,
  Flex,
  LinkOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import React from 'react'
import { AddTodoForm } from './CreateTodoForm'
import { todos } from './data'

export const TodoList = () => {
  const [show, set] = React.useState(false)
  return (
    <Flex direction="column">
      {show ? (
        <AddTodoForm />
      ) : (
        <Button alignSelf="flex-end" m="20px" onClick={() => set(!show)}>
          Add
        </Button>
      )}

      <Divider orientation="horizontal" />
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Completed</Th>
            </Tr>
          </Thead>
          <Tbody>
            {todos.map(todo => (
              <Tr key={todo.id}>
                <Td>{todo.title}</Td>
                <Td>
                  <Checkbox isChecked={todo.completed} />
                </Td>
                <Td>
                  <ButtonGroup>
                    <Button>Edit</Button>
                    <Button>Delete</Button>
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  )
}
