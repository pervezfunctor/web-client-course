import React from 'react'
import { Todo } from './state'

export type TodoItemProps = Readonly<{ todo: Todo }>

export const TodoItem = ({ todo }: TodoItemProps) => (
  <div>
    <span>{todo.id}</span>
    <span>{todo.title}</span>
    Completed: <input type="checkbox" checked={todo.completed} />
  </div>
)

export type TodoListProps = Readonly<{ todoList: readonly Todo[] }>

export const TodoList = ({ todoList }: TodoListProps) => (
  <div>
    {todoList.map(t => (
      <TodoItem key={t.id} todo={t} />
    ))}
  </div>
)
