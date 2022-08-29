import React from 'react'
import axios from 'redaxios'
import { reducer, useReducer } from '@reducer'
import { delay } from './utils'

type FetchState = Readonly<{
  data?: unknown
  error?: unknown
  isLoading: boolean
}>

const initial: FetchState = {
  data: undefined,
  error: undefined,
  isLoading: true,
}

const slice = reducer(initial, {
  success(draft, data: unknown) {
    draft.data = data
    draft.error = undefined
    draft.isLoading = false
  },
  error(draft, error: unknown) {
    draft.error = error
    draft.isLoading = false
  },
})

export function useFetch(url: string): FetchState {
  const [state, actions] = useReducer(slice)

  React.useEffect(() => {
    let cancelled = false

    delay(5000)
      .then(async () => axios.get(url))
      .then(res => {
        if (!cancelled) {
          actions.success(res.data)
        }
      })
      .catch(err => {
        if (!cancelled) {
          actions.error(err)
        }
      })

    return () => {
      cancelled = true
    }
  }, [url])

  return state
}
