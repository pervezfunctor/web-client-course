/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { Text } from '@chakra-ui/react'
import { asyncSignal, computed, signal, useValue } from '@srtp/jotai'
import { atom, useAtom } from 'jotai'
import { Suspense } from 'react'

const countAtom = signal(1)

const asyncAtom = asyncSignal(async get => {
  const cnt = get(countAtom)

  return cnt * 2
})

const asyncIncrementAtom = atom(null, async (get, set) => {
  const r = get(countAtom) + 1
  set(countAtom, r)
})

export const ComponentUsingAsyncAtoms = () => {
  const num = useValue(asyncAtom)

  return <Text>{num}</Text>
}

const App = () => {
  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <ComponentUsingAsyncAtoms />
    </Suspense>
  )
}

const anotherAtom = computed(get => get(asyncAtom) / 2)

const Component = () => {
  const [count, increment] = useAtom(asyncIncrementAtom)

  const handleClick = () => {
    increment()
  }

  return <Text>{count}</Text>
}
