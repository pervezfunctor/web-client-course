import produce, { castDraft } from 'immer'

export const map = (arr: any[], f: (x: any) => any): any[] => {
  const result = []
  for (const e of arr) {
    result.push(f(e))
  }
  return result
}

export const filter = (arr: any[], pred: (x: any) => boolean): any[] => {
  const result = []
  for (const e of arr) {
    if (pred(e)) {
      result.push(e)
    }
  }
  return result
}

export const reduce = (
  arr: any[],
  f: (x: any, acc: any) => any,
  init: any,
): any => {
  let result = init

  for (const e of arr) {
    result = f(e, result)
  }

  return result
}

export const copy = <T>(arr: readonly T[]) => [...arr]

export const push = <T>(arr: T[], v: T) => [...arr, v]
export const pop = <T>(arr: T[]) => arr.slice(0, arr.length - 1)

export const unshift = <T>(arr: T[], v: T) => [v, ...arr]
export const shift = <T>(arr: T[]) => arr.slice(1)

export const insert = <T>(arr: T[], index: number, value: T) => [
  ...arr.slice(0, index),
  value,
  ...arr.slice(index),
]

export const remove = <T>(arr: T[], index: number) => [
  ...arr.slice(0, index),
  ...arr.slice(index + 1),
]

export const merge = <T1, T2>(obj: T1, obj2: T2) => {
  return { ...obj, ...obj2 }
}

export const icopy = <T>(arr: readonly T[]) => produce(arr, () => {})

export const ipush = <T>(arr: T[], v: T) =>
  produce(arr, draft => {
    draft.push(castDraft(v))
  })

export const ipop = <T>(arr: T[]) =>
  produce(arr, draft => {
    draft.splice(arr.length - 1)
  })

export const iunshift = <T>(arr: T[], v: T) =>
  produce(arr, draft => {
    draft.unshift(castDraft(v))
  })

export const ishift = <T>(arr: T[]) =>
  produce(arr, draft => {
    draft.splice(1)
  })

export const iinsert = <T>(arr: T[], index: number, value: T) =>
  produce(arr, draft => {
    draft.splice(index, 0, castDraft(value))
  })

export const iremove = <T>(arr: T[], index: number) =>
  produce(arr, draft => {
    draft.splice(index, 1)
  })

// type Email =
