import { Draft } from 'immer'
import { useSetAtom, WritableAtom } from 'jotai'
import React from 'react'

export function useAction<Value, P extends any[]>(
  atom: WritableAtom<Value, Value | ((draft: Draft<Value>) => void)>,
  fn: (draft: Draft<Value>, ...args: P) => void,
) {
  const set = useSetAtom(atom)

  return React.useCallback(
    (...args: P) => {
      set(draft => {
        fn(draft, ...args)
      })
    },
    [fn, set],
  )
}
