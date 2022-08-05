import { slice } from '../core/slice'
import { createTodo, initialState, Todo } from '../todo'

export const { Provider, actions, useAction, useSnapshot, useSelect } = slice(
  initialState,
  {
    createTodo(draft, payload: Todo) {
      const created = createTodo(payload)
      draft.set(created.id, created)
    },

    deleteTodo(draft, payload: number) {
      draft.delete(payload)
    },

    editTodo(draft, payload: Todo) {
      const editTodo = draft.get(payload.id)
      draft.set(payload.id, { ...editTodo, ...payload })
    },

    toggleTodo(draft, payload: number) {
      const toggleTodo = draft.get(payload)
      if (toggleTodo) {
        toggleTodo.completed = !toggleTodo.completed
      }
    },
  },
)
