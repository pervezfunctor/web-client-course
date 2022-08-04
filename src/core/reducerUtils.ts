import { ensure } from '@core'
import produce from 'immer'
import { State } from 'src/state'
import { CreateTodo, Todo, createTodo } from 'src/todo'
import { z } from 'zod'

export function action<Type extends string, T extends z.ZodTypeAny>(
  type: Type,
  payload: T,
) {
  return z.object({ type: z.literal(type), payload })
}

export function actions<
  Actions extends readonly [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]],
>(specs: Actions) {
  return z.union(specs)
}

type ActionTypes<S, T extends { type: any; payload: unknown }> = {
  [K in T as K['type']]: (state: S, payload: K['payload']) => void
}

export function slice<
  State extends z.ZodTypeAny,
  Actions extends z.ZodUnion<any>,
>(_: State, actions: Actions) {
  return (
    reducer: ActionTypes<z.infer<State>, z.infer<Actions>>,
  ): ((state: z.infer<State>, action: z.infer<Actions>) => z.infer<State>) => {
    return produce((state, action) => {
      ensure(actions, action)
      ensure(state, reducer[action](state, action))
    })
  }
}

const TodoAction = actions([
  action('createTodo', CreateTodo),
  action('deleteTodo', z.number()),
  action('toggleTodo', z.number()),
  action('editTodo', Todo),
])

export type TodoAction = Readonly<z.infer<typeof TodoAction>>

export const todoReducer = slice(
  State,
  TodoAction,
)({
  createTodo(draft, payload) {
    const created = createTodo(payload)
    draft.set(created.id, created)
  },

  deleteTodo: (draft, payload) => {
    draft.delete(payload)
  },

  editTodo: (draft, payload) => {
    const editTodo = draft.get(payload.id)
    draft.set(payload.id, { ...editTodo, ...payload })
  },

  toggleTodo: (draft, payload) => {
    const toggleTodo = draft.get(payload)
    if (toggleTodo) {
      toggleTodo.completed = !toggleTodo.completed
    }
  },
})
