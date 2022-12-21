import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import { TodoApp } from './use-query'

export const App = () => (
  <ChakraProvider>
    <TodoApp />
  </ChakraProvider>
)
