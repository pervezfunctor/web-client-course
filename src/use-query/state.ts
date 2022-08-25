import produce from 'immer'
import {
  createTodo as create,
  CreateTodo,
  Filter,
  initialState,
  Todo,
} from '../todo'

let state = new Map<number, Todo>(initialState.todos)

export const createTodo = async (todo: CreateTodo) => {
  const created = create(todo)
  state = produce(state, draft => {
    draft.set(created.id, created)
  })

  return Promise.resolve(created)
}

export const deleteTodo = async (id: number) => {
  const deleted = state.get(id)
  state = produce(state, draft => {
    if (!draft.delete(id)) {
      throw new Error(`no todo with id: ${id}`)
    }
  })

  return Promise.resolve(deleted)
}

export const editTodo = async (todo: Todo) => {
  const editTodo = state.get(todo.id)
  state = produce(state, draft => {
    draft.set(todo.id, { ...editTodo, ...todo })
  })

  return Promise.resolve(editTodo)
}

export const toggleTodo = async (id: number) => {
  state = produce(state, draft => {
    const toggleTodo = draft.get(id)
    if (toggleTodo) {
      toggleTodo.completed = !toggleTodo.completed
    }
  })

  return Promise.resolve(state.get(id))
}

export const all = (filter?: Filter) => {
  const todoList = Array.from(state.values())

  return filter === 'All' || filter === undefined
    ? todoList
    : filter === 'Completed'
    ? todoList.filter(t => t.completed)
    : todoList.filter(t => !t.completed)
}
