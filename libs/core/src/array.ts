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

export const merge = <T1, T2>(obj: T1, obj2: T2) => {
  return { ...obj, ...obj2 }
}

export const paged = <T>(arr: T[], current: number, limit: number) => {
  const page = current - 1
  const items = arr.slice(page * limit, (page + 1) * limit)
  return items
}
