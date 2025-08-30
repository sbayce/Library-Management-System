import { z } from "zod"

export const checkoutBookSchema = z.object({
  bookId: z.number().int().positive(),
  borrowerId: z.number().int().positive(),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val))
    .refine((date) => date >= new Date(), {
      message: "Due date cannot be in the past",
    }),
})
