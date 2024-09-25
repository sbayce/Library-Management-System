import { Router } from 'express'
import exportBorrowingReport from '../controllers/analytics/export-borrowing-report'
import exportOverdueLastMonth from '../controllers/analytics/export-overdue-last-month'
import exportBorrowingsLastMonth from '../controllers/analytics/export-borrowings-last-month'

const router = Router()

router.get('/borrowing-report', exportBorrowingReport)
router.get('/last-month-overdue', exportOverdueLastMonth)
router.get('/last-month-borrowing', exportBorrowingsLastMonth)

export default router