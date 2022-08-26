import { isStr, jstr } from './casts'

import { z } from 'zod'

export const strict = <T extends z.ZodRawShape>(o: T) => z.object(o).strict()
export type Infer<T extends z.ZodTypeAny> = Readonly<z.infer<T>> // TODO: DeepReadonly

export const jlog = (o: unknown): void => {
  console.log(jstr(o))
}

export const logError = (error?: unknown) => {
  if (!error) {
    return
  }
  if (isStr(error)) {
    console.error(error)
  } else {
    console.log(jstr(error))
  }
}

export const delay = async (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))
