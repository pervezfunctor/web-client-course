import { Filter, Todo } from '../todo'
import axios from 'redaxios'

export const filteredTodos = (todoList: readonly Todo[], filter: Filter) =>
  todoList.filter(
    t =>
      filter === 'All' || (filter === 'Completed' ? t.completed : !t.completed),
  )

export const del = async (todoId: number) =>
  (await axios.delete(`/api/todos/${todoId}`)).data

export const toggle = async (todo: Todo) =>
  (
    await axios.patch(`/api/todos/${todo.id}`, {
      ...todo,
      completed: !todo.completed,
    })
  ).data
