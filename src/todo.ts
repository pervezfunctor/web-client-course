import { z } from 'zod'
import { cast, Infer, strict } from '@core'

export const Todo = strict({
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
})

export type Todo = Infer<typeof Todo>

export const CreateTodo = Todo.omit({ id: true })
export type CreateTodo = Infer<typeof CreateTodo>

let nextId = 1000

export function createTodo(todo: CreateTodo): Todo {
  return { ...cast(CreateTodo, todo), id: nextId++ }
}
