import { Router } from "express"
import { validateQuery } from "../middleware/validation"
import { exportBorrowingReport } from "../controllers/analytics/export-borrowing-report"
import { exportBorrowingReportSchema } from "../schemas/analytics"
import { exportOverdueLastMonth } from "../controllers/analytics/export-overdue-last-month"
import { exportBorrowingLastMonth } from "../controllers/analytics/export-borrowings-last-month"

const analyticsRouter = Router()

analyticsRouter.get(
  "/",
  validateQuery(exportBorrowingReportSchema),
  exportBorrowingReport
)
analyticsRouter.get("/overdue", exportOverdueLastMonth)
analyticsRouter.get("/last-month", exportBorrowingLastMonth)

export default analyticsRouter
