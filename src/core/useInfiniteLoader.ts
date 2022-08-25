import React from 'react'
import { useIntersectionObserver } from './useIntersectionObserver'

export const useInfiniteLoader = (
  element: React.RefObject<any>,
  fn: () => void,
) => {
  const visible = useIntersectionObserver(element)
  React.useEffect(() => {
    if (visible) {
      fn()
    }
  }, [fn, visible])
}
