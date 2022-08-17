import React, {
  Dispatch,
  ReducerAction,
  useCallback,
  useLayoutEffect,
  useMemo,
} from 'react'
import invariant from 'tiny-invariant'
import { useImmerReducer } from 'use-immer'

type Reducer<S, A> = (prevState: S, action: A) => void

type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any>
  ? S
  : never

type Selector<R extends Reducer<any, any>, A> = (snapshot: ReducerState<R>) => A

export function reducerProvider<R extends Reducer<any, any>>(
  reducer: R,
  initialState: ReducerState<R>,
) {
  const StateContext = React.createContext<ReducerState<R> | undefined>(
    undefined,
  )

  const DispatchContext = React.createContext<
    Dispatch<ReducerAction<R>> | undefined
  >(undefined)

  const Provider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useImmerReducer(reducer, initialState)

    return (
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          {children}
        </DispatchContext.Provider>
      </StateContext.Provider>
    )
  }

  const useSnapshot = () => {
    const ctx = React.useContext(StateContext)
    invariant(ctx !== undefined, 'Need ReducerProvider')
    return ctx
  }

  const useDispatch = () => {
    const ctx = React.useContext(DispatchContext)
    invariant(ctx !== undefined, 'Need ReducerProvider')

    return ctx
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

  function useSelect<A>(select: Selector<R, A>): A {
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
