import { z } from 'zod'

export const strict = <T extends z.ZodRawShape>(o: T) => z.object(o).strict()
export type Infer<T extends z.ZodTypeAny> = Readonly<z.infer<T>> // TODO: DeepReadonly
