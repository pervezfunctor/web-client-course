import { Box, Button, Text } from '@chakra-ui/react'
import React from 'react'
import { reducerHook } from '@reducer'

export const useCounter = reducerHook(
  { count: 0 },
  {
    onInc(state) {
      state.count++
    },
    onDec(state) {
      state.count--
    },
  },
)

export const Counter = () => {
  const [state, { onDec, onInc }] = useCounter()

  return (
    <Box>
      <Button onClick={onInc}>+</Button>
      <Text>{state.count}</Text>
      <Button onClick={onDec}>-</Button>
    </Box>
  )
}
