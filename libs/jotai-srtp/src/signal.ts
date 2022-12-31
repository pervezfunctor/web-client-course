import { atom, Atom, WritableAtom } from 'jotai'
import { selectAtom } from 'jotai/utils'
import { PrimitiveAtom } from 'jotai'
import { Read, Write } from './types'

// @TODO: Value extends object?
export function signal<Value>(initialValue: Value) {
  return atom(initialValue)
}

export function signals<Value>() {
  return signal<PrimitiveAtom<Value>[]>([])
}

export function action<
  Value,
  Update,
  Result extends void | Promise<void> = void,
>(write: Write<Update, Result>, initialValue?: Value) {
  return atom(initialValue ?? null, write)
}

export function computed<Value>(read: Read<Value>) {
  return atom(read)
}

export const select = selectAtom

export function derived<
  Value,
  Update,
  Result extends void | Promise<void> = void,
>(
  read: Read<Value>,
  write: Write<Update, Result>,
): WritableAtom<Value, Update, Result> {
  return atom(read, write)
}
