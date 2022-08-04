/* eslint-disable no-console */

import { isStr } from './casts'
import { jstr } from './casts'

export const jlog = (o: unknown): void => {
  // eslint-disable-next-line no-console
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
