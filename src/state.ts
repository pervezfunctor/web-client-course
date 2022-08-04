import { cast, Infer, strict } from '@core'
import { produce } from 'immer'
import { z } from 'zod'
import { CreateTodo, createTodo, Todo } from './todo'

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
