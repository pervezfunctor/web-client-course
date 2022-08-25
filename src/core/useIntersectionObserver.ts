import React from 'react'

export const useIntersectionObserver = (
  ref: React.RefObject<any>,
  options: IntersectionObserverInit = { threshold: 0.5 },
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false)

  React.useEffect(() => {
    const node = ref.current
    if (!node) {
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    if (node) {
      observer.observe(node)
    }

    return () => {
      observer.unobserve(node)
    }
  }, [options, ref])

  return isIntersecting
}
