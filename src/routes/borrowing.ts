import { Router } from 'express'
import checkoutBook from '../controllers/borrowing/checkout-book'
import returnBook from '../controllers/borrowing/return-book'

const router = Router()

router.post('/checkout', checkoutBook)
router.post('/return', returnBook)

export default router