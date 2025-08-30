import { Router } from "express"
import { validateBody, validateParams } from "../middleware/validation"
import { checkoutBookSchema } from "../schemas/borrowing"
import { checkoutBook } from "../controllers/borrowing/checkout-book"

const borrowingRouter = Router()

borrowingRouter.post("/", validateBody(checkoutBookSchema), checkoutBook)

export default borrowingRouter
