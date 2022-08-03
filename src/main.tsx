import React from 'react'

import './index.css'
import { App } from './App'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'

const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
