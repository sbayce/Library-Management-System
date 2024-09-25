import { Router } from 'express'
import registerBorrower from '../controllers/borrower/register-borrower'
import updateBorrower from '../controllers/borrower/update-borrower'
import deleteBorrower from '../controllers/borrower/delete-borrower'
import getBorrowers from '../controllers/borrower/get-borrowers'

const router = Router()

router.get('/all', getBorrowers)
router.post('/register', registerBorrower)
router.delete('/delete/:borrowerId', deleteBorrower)
router.patch('/update/:borrowerId', updateBorrower)

export default router