import { Router } from "express"
import { validateBody, validateParams } from "../middleware/validation"
import { checkoutBookSchema } from "../schemas/borrowing"
import { checkoutBook } from "../controllers/borrowing/checkout-book"
import { getActiveBorrowings } from "../controllers/borrowing/get-active-borrowings"
import { getOverdueBooks } from "../controllers/borrowing/get-overdue-books"
import { getUserBorrowings } from "../controllers/borrowing/get-user-borrowings"
import { createParamIdSchema } from "../schemas/params"
import { returnBook } from "../controllers/borrowing/return-book"
import { returnBookSchema } from "../schemas/borrowing"

const borrowingRouter = Router()

borrowingRouter.get("/", getActiveBorrowings)
borrowingRouter.get("/overdue", getOverdueBooks)
borrowingRouter.get(
  "/:borrowerId",
  validateParams(createParamIdSchema("borrowerId")),
  getUserBorrowings
)
borrowingRouter.post("/", validateBody(checkoutBookSchema), checkoutBook)
borrowingRouter.post("/return", validateBody(returnBookSchema), returnBook)

export default borrowingRouter
