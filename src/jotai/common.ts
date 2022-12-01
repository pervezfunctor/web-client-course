import { Draft } from 'immer'
import { useAtom, WritableAtom } from 'jotai'
import React from 'react'

export function useAction<Value, P extends any[]>(
  atom: WritableAtom<Value, Value | ((draft: Draft<Value>) => void)>,
  fn: (draft: Draft<Value>, ...args: P) => void,
) {
  const [, set] = useAtom(atom)

  return React.useCallback((...args: P) => {
    set(draft => {
      fn(draft, ...args)
    })
  }, [])
}
