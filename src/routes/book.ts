import { Router } from 'express'
import getBooks from '../controllers/book/get-books'
import searchBooks from '../controllers/book/search-books'
import addBook from '../controllers/book/add-book'
import deleteBook from '../controllers/book/delete-book'
import updateBook from '../controllers/book/update-book'

const router = Router()

router.get('/all', getBooks)
router.get('/search', searchBooks)
router.post('/add', addBook)
router.delete('/delete/:bookId', deleteBook)
router.patch('/update/:bookId', updateBook)

export default router