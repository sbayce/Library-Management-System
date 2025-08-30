import { Router } from "express"
import { validateBody, validateParams } from "../middleware/validation"
import { registerBorrowerSchema } from "../schemas/borrower"
import { createParamIdSchema } from "../schemas/params"
import { registerBorrower } from "../controllers/borrower/register-borrower"
import { updateBorrower } from "../controllers/borrower/update-borrower"
import { getBorrowers } from "../controllers/borrower/get-borrowers"
import { deleteBorrower } from "../controllers/borrower/delete-borrower"

const borrowerRouter = Router()

borrowerRouter.get("/", getBorrowers)
borrowerRouter.post("/", validateBody(registerBorrowerSchema), registerBorrower)
borrowerRouter.put(
  "/:borrowerId",
  validateParams(createParamIdSchema("borrowerId")),
  validateBody(registerBorrowerSchema),
  updateBorrower
)
borrowerRouter.delete(
  "/:borrowerId",
  validateParams(createParamIdSchema("borrowerId")),
  deleteBorrower
)

export default borrowerRouter
