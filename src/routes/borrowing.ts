import { Router } from 'express'
import checkoutBook from '../controllers/borrowing/checkout-book'
import returnBook from '../controllers/borrowing/return-book'
import getActiveBorrowings from '../controllers/borrowing/get-active-borrowings'
import getUserBorrowings from '../controllers/borrowing/get-user-borrowings'
import getOverdueBooks from '../controllers/borrowing/get-overdue-books'

const router = Router()

router.get('/active', getActiveBorrowings)
router.get('/my', getUserBorrowings)
router.get('/overdue', getOverdueBooks)
router.post('/checkout', checkoutBook)
router.post('/return', returnBook)

export default router