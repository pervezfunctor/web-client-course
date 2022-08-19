/* eslint-disable @typescript-eslint/naming-convention */
import { castDraft, Draft } from 'immer'
import React from 'react'
import { useImmerReducer } from 'use-immer'
import { reducerProvider } from './provider'

type ReducerObject<State> = Record<
  string,
  (state: Draft<State>, payload: any) => void
>

type ActionsFrom<State, Reducers extends ReducerObject<State>> = {
  [Action in keyof Reducers]: {
    type: Action
    payload: Parameters<Reducers[Action]>[1]
  }
}[keyof Reducers]

type ActionResult<
  Reducers extends ReducerObject<any>,
  Action extends keyof Reducers,
> = {
  type: Action
  payload: Parameters<Reducers[Action]>[1]
}

type ActionsCreators<State, Reducers extends ReducerObject<State>> = {
  [Action in keyof Reducers]: Parameters<Reducers[Action]>[1] extends undefined
    ? () => ActionResult<Reducers, Action>
    : (
        payload: Parameters<Reducers[Action]>[1],
      ) => ActionResult<Reducers, Action>
}

type Actions<State, Reducers extends ReducerObject<State>> = {
  [Action in keyof Reducers]: Parameters<Reducers[Action]>[1] extends undefined
    ? () => void
    : (payload: Parameters<Reducers[Action]>[1]) => void
}

type Reducer<State, Reducers extends ReducerObject<State>> = (
  state: Draft<State>,
  action: ActionsFrom<State, Reducers>,
) => void

export function reducer<State, Reducers extends ReducerObject<State>>(
  initialState: State,
  reducers: Reducers,
) {
  const fn: Reducer<State, Reducers> = (state, action) => {
    reducers[action.type](state, action.payload)
  }

  const actions: ActionsCreators<State, Reducers> = {} as any
  for (const type of Object.keys(reducers)) {
    ;(actions as any)[type] = (payload: any) => ({ type, payload })
  }

  return [fn, actions, initialState] as const
}

export function useReducer<State, Reducers extends ReducerObject<State>>(
  args: readonly [
    reducer: Reducer<State, Reducers>,
    actionCreators: ActionsCreators<State, Reducers>,
    initialState: State,
  ],
) {
  const [reducer, actionCreators, initialState] = args

  const actions: Actions<State, Reducers> = React.useMemo(() => {
    const result = {} as any
    for (const type of Object.keys(actionCreators)) {
      result[type] = (...args: any[]) => {
        dispatch((actionCreators[type] as any)(...args))
      }
    }
    return result
  }, [])

  const [state, dispatch] = useImmerReducer(reducer, initialState)

  return [state, actions] as const
}

export function reducerHook<State, Reducers extends ReducerObject<State>>(
  initialState: State,
  reducers: Reducers,
) {
  return () =>
    useReducer(React.useMemo(() => reducer(initialState, reducers), []))
}

export function providerHook<State, Reducers extends ReducerObject<State>>(
  initialState: State,
  reducers: Reducers,
) {
  const [fn, actions] = reducer<State, Reducers>(initialState, reducers)

  const { useValue, ...rest } = reducerProvider(fn, castDraft(initialState))

  const useSlice = () => {
    return [useValue(), actions] as const
  }

  return {
    actions,
    useSlice,
    useValue,
    ...rest,
  }
}
