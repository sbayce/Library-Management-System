import { z } from "zod"

export const createParamIdSchema = (paramName: string) => {
  return z.object({
    [paramName]: z.string().regex(/^\d+$/, `${paramName} must be a number`),
  })
}
