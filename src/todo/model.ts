import { cast, Infer, strict } from '../core'
import { z } from 'zod'

export const Todo = strict({
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
})

export type Todo = Infer<typeof Todo>
export type MutTodo = z.infer<typeof Todo>

export const CreateTodo = Todo.omit({ id: true })
export type CreateTodo = Infer<typeof CreateTodo>

let nextId = 1000

export function createTodo(todo: CreateTodo): Todo {
  return { ...cast(CreateTodo, todo), id: nextId++ }
}

export const State = z.map(z.number(), Todo)
export type State = Infer<typeof State>
