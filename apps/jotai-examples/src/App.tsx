import { ChakraProvider } from '@chakra-ui/react'
import { enableMapSet } from 'immer'
import { Provider } from 'jotai'
import { TodoApp } from './examples'
import { DecCounter } from './examples/DecCounter'

enableMapSet()

export const App = () => (
  <ChakraProvider>
    <Provider>
      <DecCounter />
      <TodoApp />
    </Provider>
  </ChakraProvider>
)
