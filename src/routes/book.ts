import { Router } from "express"
import { validateBody, validateParams } from "../middleware/validation"
import { createBookSchema, updateBookSchema } from "../schemas/book"
import { createParamIdSchema } from "../schemas/params"
import { createBook } from "../controllers/books/create-book"
import { updateBook } from "../controllers/books/update-book"
import { deleteBook } from "../controllers/books/delete-book"
import { getBooks } from "../controllers/books/get-books"
import { rateLimit } from "express-rate-limit"

// rate limiter middleware
const limiter = rateLimit({
  windowMs: 60000, // 1 minute time window
  limit: 10, // 10 requests
  standardHeaders: true,
  legacyHeaders: false,
})

const bookRouter = Router()

bookRouter.get("/", limiter, getBooks)
bookRouter.post("/", limiter, validateBody(createBookSchema), createBook)
bookRouter.put(
  "/:bookId",
  validateParams(createParamIdSchema("bookId")),
  validateBody(updateBookSchema),
  updateBook
)
bookRouter.delete(
  "/:bookId",
  validateParams(createParamIdSchema("bookId")),
  deleteBook
)

export default bookRouter
