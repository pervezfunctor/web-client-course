import { ChakraProvider, Container } from '@chakra-ui/react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { TodoApp } from './use-query'

const root = createRoot(document.getElementById('root')!)

root.render(
  <ChakraProvider>
    <Container>
      <React.StrictMode>
        <TodoApp />
      </React.StrictMode>
    </Container>
  </ChakraProvider>,
)
