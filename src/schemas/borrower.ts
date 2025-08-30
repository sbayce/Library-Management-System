import { z } from "zod"

export const registerBorrowerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  email: z.email("Invalid email address"),
})

export const updateBorrowerSchema = registerBorrowerSchema
