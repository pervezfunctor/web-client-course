/* eslint-disable default-case */
/* eslint-disable no-redeclare */

import { cast } from '@core'
import { produce } from 'immer'
import { z, ZodRawShape, ZodTypeAny } from 'zod'

export const strict = <T extends ZodRawShape>(o: T) => z.object(o).strict()
export type Infer<T extends ZodTypeAny> = Readonly<z.infer<T>> // TODO: DeepReadonly

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

export const State = z.map(z.number(), Todo)
export type State = Infer<typeof State>

export const Action = z.union([
  strict({ type: z.literal('createTodo'), todo: CreateTodo }),
  strict({ type: z.literal('deleteTodo'), id: z.number() }),
  strict({ type: z.literal('toggleTodo'), id: z.number() }),
  strict({ type: z.literal('editTodo'), todo: Todo }),
])

export type Action = Infer<typeof Action>

export const todoReducer = produce((draft: State, action: Action) => {
  action = cast(Action, action)

  switch (action.type) {
    case 'createTodo':
      const created = createTodo(action.todo)
      draft.set(created.id, created)
      break

    case 'deleteTodo':
      draft.delete(action.id)
      break

    case 'editTodo':
      const editTodo = draft.get(action.todo.id)
      draft.set(action.todo.id, { ...editTodo, ...action.todo })
      break

    case 'toggleTodo':
      const toggleTodo = draft.get(action.id)
      if (toggleTodo) {
        toggleTodo.completed = !toggleTodo.completed
      }
  }
})
