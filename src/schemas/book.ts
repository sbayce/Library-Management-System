import { z } from "zod"

export const createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  isbn: z
    .string()
    .min(10, "ISBN must be at least 10 characters")
    .max(13, "ISBN must be at most 13 characters"),
  availableQuantity: z
    .number()
    .int("Quantity must be an integer")
    .nonnegative("Quantity cannot be negative"),
  shelfLocation: z.string().min(1, "Shelf location is required"),
})

export const updateBookSchema = createBookSchema

export const getBooksSchema = z.object({
  search: z.string().optional(),
  page: z
    .string()
    .regex(/^\d+$/, "Page must be a number")
    .transform(Number)
    .default(1),
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a number")
    .transform(Number)
    .default(10),
})
