import { Box, Button, Heading, Text } from '@chakra-ui/react'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import React from 'react'

const counterAtom = atom(0)

const incAtom = atom(null, (get, set, _) => {
  const next = get(counterAtom) + 1
  set(counterAtom, next)
})

const decAtom = atom(null, (get, set, _) => {
  const next = get(counterAtom) - 1
  if (next >= 0) {
    set(counterAtom, next)
  }
})

const CounterView = () => {
  const count = useAtomValue(counterAtom)

  return (
    <Text fontSize="3xl" pl="5">
      {count}
    </Text>
  )
}

const CounterActions = () => {
  const inc = useSetAtom(incAtom)
  const dec = useSetAtom(decAtom)

  return (
    <Box>
      <Button onClick={inc}>+</Button>
      <Button onClick={dec}>-</Button>
    </Box>
  )
}

const Header = () => {
  React.useEffect(() => {
    console.log('header')
  })

  return <Heading textAlign="center">Jotai Course</Heading>
}

export const JotaiCounter = () => (
  <Box>
    <Header />
    <CounterView />
    <CounterActions />
  </Box>
)
