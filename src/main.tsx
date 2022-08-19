import { Box, Container, Input, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'

import { createRoot } from 'react-dom/client'
import { reducerHook } from './reducer'
import './index.css'

const root = createRoot(document.getElementById('root')!)

const initial = { step: 1, count: 0 }

const useStepCount = reducerHook(initial, {
  next(draft) {
    draft.count = draft.count + draft.step
  },

  setStep(draft, step: number) {
    draft.step = step
  },
})

const Counter = () => {
  const [{ count }, { next, setStep }] = useStepCount()

  useEffect(() => {
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

root.render(
  <Container>
    <React.StrictMode>
      <Counter />
    </React.StrictMode>
  </Container>,
)
