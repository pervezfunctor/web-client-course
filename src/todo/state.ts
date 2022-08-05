import { proxy } from 'valtio'
import { todos } from './data'
import { Todo } from '../state'

const state = proxy({
  todos,
  onCreate: (todo: Todo) => {
    state.todos.push(todo)
  },
  onToggle: (id: number) => {
    const found = state.todos[id]
    if (found) {
      found.completed = !found.completed
    }
  },
  onDelete: (id: number) => {
    const todo = state.todos[id]
    const found = state.todos.indexOf(todo)
    todos.splice(found, 1)
  },
  onUpdateTitle: (id: number, title: string) => {
    const found = state.todos[id]
    found.title = title
  },
})
