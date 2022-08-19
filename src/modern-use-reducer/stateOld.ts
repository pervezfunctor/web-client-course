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
    draft.todos.set(created.id, created)
  },

  deleteTodo(draft, payload) {
    draft.todos.delete(payload)
  },

  editTodo(draft, payload) {
    const editTodo = draft.todos.get(payload.id)
    draft.todos.set(payload.id, { ...editTodo, ...payload })
  },

  toggleTodo(draft, payload) {
    const toggleTodo = draft.todos.get(payload)
    if (toggleTodo) {
      toggleTodo.completed = !toggleTodo.completed
    }
  },
})

export const { Provider, useAction, useDispatch, useSelect, useSnapshot } =
  reducerProvider(todoReducer, initialState)