import { Box, Input, Text } from '@chakra-ui/react'
import React from 'react'
import { reducerHook } from './reducer'

const initial = { step: 1, count: 0 }

const useStep = reducerHook(initial, {
  next(draft) {
    draft.count++
  },
  setStep(draft, step) {
    draft.step = step
  },
})

export const Counter = () => {
  const [{ count }, { next, setStep }] = useStep()

  React.useEffect(() => {
    const id = setInterval(() => {
      next()
    }, 1000)

    return () => clearInterval(id)
  }, [])

  return (
    <Box>
      <Text>{count}</Text>
      <Input onChange={evt => setStep(+evt.target.value)} />
    </Box>
  )
}
