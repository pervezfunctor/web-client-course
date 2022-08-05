import React, {
  Dispatch,
  Reducer,
  ReducerAction,
  ReducerState,
  useCallback,
  useLayoutEffect,
  useMemo,
} from 'react'
import invariant from 'tiny-invariant'

export function reducerProvider<R extends Reducer<any, any>>(
  reducer: R,
  initialState: ReducerState<R>,
) {
  const ReducerContext = React.createContext<
    [ReducerState<R>, Dispatch<ReducerAction<R>>] | undefined
  >(undefined)

  const Provider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = React.useReducer(reducer, initialState)

    return (
      <ReducerContext.Provider value={[state, dispatch]}>
        {children}
      </ReducerContext.Provider>
    )
  }

  const useSnapshot = () => {
    const ctx = React.useContext(ReducerContext)
    invariant(ctx !== undefined, 'Need ReducerProvider')
    return ctx[0]
  }

  const useDispatch = () => {
    const ctx = React.useContext(ReducerContext)
    invariant(ctx !== undefined, 'Need ReducerProvider')

    return ctx[1]
  }

  function useAction<Args extends any[]>(
    handler: (...args: Args) => ReducerAction<R>,
  ) {
    const ref = React.useRef(handler)
    const dispatch = useDispatch()

    useLayoutEffect(() => {
      ref.current = handler
    })

    return useCallback((...args: Args) => {
      dispatch(ref.current(...args))
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  }

  function useSelect<A>(select: (snapshot: ReducerState<R>) => A): A {
    const snapshot = useSnapshot()
    const ref = React.useRef(select)
    useLayoutEffect(() => {
      ref.current = select
    })
    return useMemo(() => ref.current(snapshot), [snapshot])
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  return { Provider, useSnapshot, useDispatch, useSelect, useAction }
}
