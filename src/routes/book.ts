import { Router } from 'express'
import getBooks from '../controllers/book/get-books'
import searchBooks from '../controllers/book/search-books'
import addBook from '../controllers/book/add-book'
import deleteBook from '../controllers/book/delete-book'
import updateBook from '../controllers/book/update-book'
import { rateLimit } from "express-rate-limit"

// rate limiter middleware
const limiter = rateLimit({
    windowMs: 60000, // 1 minute time window
    limit: 10, // 10 requests
    standardHeaders: true,
    legacyHeaders: false
})

const router = Router()

router.get('/all', limiter, getBooks)
router.get('/search', limiter, searchBooks)
router.post('/add', addBook)
router.delete('/delete/:bookId', deleteBook)
router.patch('/update/:bookId', updateBook)

export default router