import { proxyMap } from 'valtio/utils'
import { CreateTodo, createTodo as create, Todo, MutTodo } from '../todo'
import { initialState } from '../todo'

export const state = proxyMap<number, MutTodo>(initialState)

export function createTodo(todo: CreateTodo) {
  const created = create(todo)
  state.set(created.id, created)
}

export function deleteTodo(id: number) {
  state.delete(id)
}

export function editTodo(todo: Todo) {
  const editTodo = state.get(todo.id)
  state.set(todo.id, { ...editTodo, ...todo })
}

export function toggleTodo(id: number) {
  const toggleTodo = state.get(id)
  if (toggleTodo) {
    toggleTodo.completed = !toggleTodo.completed
  }
}
