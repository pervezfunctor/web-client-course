import { jstr } from './casts'

export const jlog = (o: unknown): void => {
  // eslint-disable-next-line no-console
  console.log(jstr(o))
}
