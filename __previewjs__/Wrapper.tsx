import { ChakraProvider, Heading } from '@chakra-ui/react'
import React from 'react'

export const Wrapper = ({ children }) => (
  <ChakraProvider>{children}</ChakraProvider>
)
