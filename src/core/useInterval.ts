import React, { useEffect } from 'react'

export const useInterval = (fn: () => void, delay: number) => {
  const callback = React.useRef<() => void>(fn)

  useEffect(() => {
    callback.current = fn
  })

  useEffect(() => {
    const id = setInterval(() => {
      callback.current()
    }, delay)

    return () => clearInterval(id)
  }, [delay])
}
