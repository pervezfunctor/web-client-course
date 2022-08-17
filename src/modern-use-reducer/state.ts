import { slice } from '../core/slice'
import { createTodo, Filter, initialState, Todo } from '../todo'

export const { Provider, actions, useAction, useSnapshot, useSelect } = slice(
  initialState,
  {
    createTodo(draft, payload: Todo) {
      const created = createTodo(payload)
      draft.todos.set(created.id, created)
    },

    deleteTodo(draft, payload: number) {
      draft.todos.delete(payload)
    },

    editTodo(draft, payload: Todo) {
      const editTodo = draft.todos.get(payload.id)
      draft.todos.set(payload.id, { ...editTodo, ...payload })
    },

    toggleTodo(draft, payload: number) {
      const toggleTodo = draft.todos.get(payload)
      if (toggleTodo) {
        toggleTodo.completed = !toggleTodo.completed
      }
    },
    setFilter(draft, payload: Filter) {
      draft.filter = payload
    },
  },
)
