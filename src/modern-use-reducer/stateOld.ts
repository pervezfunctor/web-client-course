import { z } from 'zod'
import { action, actions, reducerProvider, sslice } from '../core'
import { createTodo, CreateTodo, initialState, State, Todo } from '../todo'

const TodoAction = actions([
  action('createTodo', CreateTodo),
  action('deleteTodo', z.number()),
  action('toggleTodo', z.number()),
  action('editTodo', Todo),
])

export type TodoAction = Readonly<z.infer<typeof TodoAction>>

export const todoReducer = sslice(
  State,
  TodoAction,
)({
  createTodo(draft, payload) {
    const created = createTodo(payload)
    draft.set(created.id, created)
  },

  deleteTodo(draft, payload) {
    draft.delete(payload)
  },

  editTodo(draft, payload) {
    const editTodo = draft.get(payload.id)
    draft.set(payload.id, { ...editTodo, ...payload })
  },

  toggleTodo(draft, payload) {
    const toggleTodo = draft.get(payload)
    if (toggleTodo) {
      toggleTodo.completed = !toggleTodo.completed
    }
  },
})

export const { Provider, useAction, useDispatch, useSelect, useSnapshot } =
  reducerProvider(todoReducer, initialState)
