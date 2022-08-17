/* eslint-disable @typescript-eslint/naming-convention */
import { reducerProvider } from '../core'

type ReducerObject<State> = {
  [action: string]: (state: State, payload: any) => void
}

type ActionsFrom<State, Reducers extends ReducerObject<State>> = {
  [Action in keyof Reducers]: {
    type: Action
    payload: Parameters<Reducers[Action]>[1]
  }
}[keyof Reducers]

type ActionsCreators<State, Reducers extends ReducerObject<State>> = {
  [Action in keyof Reducers]: (payload: Parameters<Reducers[Action]>[1]) => {
    type: Action
    payload: Parameters<Reducers[Action]>[1]
  }
}

type Reducer<State, Reducers extends ReducerObject<State>> = (
  state: State,
  action: ActionsFrom<State, Reducers>,
) => void

export function slice<State, Reducers extends ReducerObject<State>>(
  initialState: State,
  reducers: Reducers,
) {
  const reducer: Reducer<State, Reducers> = (state, action) => {
    reducers[action.type](state, action.payload)
  }

  const actions: ActionsCreators<State, Reducers> = {} as any
  for (const type of Object.keys(reducers)) {
    ;(actions as any)[type] = (payload: any) => ({ type, payload })
  }

  const { Provider, useAction, useDispatch, useSelect, useSnapshot } =
    reducerProvider(reducer, initialState)

  return {
    Provider,
    reducer,
    actions,
    useSnapshot,
    useSelect,
    useAction,
    useDispatch,
  }
}
