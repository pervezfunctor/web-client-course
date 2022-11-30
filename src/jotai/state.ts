import { Draft } from 'immer'
import { atom, useAtom, WritableAtom } from 'jotai'

import { atomWithImmer } from 'jotai-immer'
import { useCallback } from 'react'
import {
  createTodo,
  CreateTodo,
  Filter,
  initialState,
  State,
  Todo,
} from '../todo'

export const todosAtom = atomWithImmer(initialState.todos)
export const filterAtom = atom<Filter>('All')

export function useSet<Value, P extends any[]>(
  atom: WritableAtom<Value, Value | ((draft: Draft<Value>) => void)>,
  fn: (draft: Draft<Value>, ...args: P) => void,
) {
  const [, set] = useAtom(atom)

  return useCallback((...args: P) => {
    set(draft => {
      fn(draft, ...args)
    })
  }, [])
}

const useSetTodo = <P extends any[]>(
  fn: (draft: Draft<State['todos']>, ...args: P) => void,
) => useSet(todosAtom, fn)

export const useCreate = () =>
  useSetTodo((draft, todo: CreateTodo) => {
    const created = createTodo(todo)
    draft.set(created.id, created)
  })

export const useDelete = () =>
  useSetTodo((draft, id: number) => {
    draft.delete(id)
  })

export const useEdit = () =>
  useSetTodo((draft, todo: Todo) => {
    const editTodo = draft.get(todo.id)
    draft.set(todo.id, { ...editTodo, ...todo })
  })

export const useToggle = () =>
  useSetTodo((draft, id: number) => {
    const toggleTodo = draft.get(id)
    if (toggleTodo) {
      toggleTodo.completed = !toggleTodo.completed
    }
  })

export const filteredTodos = atom(get => {
  const todoList = Array.from(get(todosAtom).values())
  const filter = get(filterAtom)

  return filter === 'All'
    ? todoList
    : filter === 'Completed'
    ? todoList.filter(t => t.completed)
    : todoList.filter(t => !t.completed)
})
