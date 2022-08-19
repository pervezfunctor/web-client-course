import React from 'react'

export const useSignal = () => {
  const signalled = React.useRef(false)

  const signal = React.useCallback(() => {
    signalled.current = true
  }, [])

  return [signalled, signal] as const
}
