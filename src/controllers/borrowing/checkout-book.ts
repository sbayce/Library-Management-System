import { Request, Response } from "express"
import {checkoutBookQuery, getBookQuery, getBorrowerQuery, checkExistingBorrowingQuery} from "../../queries/borrowing/checkout-book"
import updateBookQuantityQuery from "../../queries/borrowing/update-quantity"
import * as db from '../../database/index'

const checkoutBook = async (req: Request, res: Response) => {
  try {
    const {book_id, borrower_id} = req.body

    if(!book_id || !borrower_id){
        return res.status(400).json({
            error: "Bad Request",
            message: "book_id, and borrower_id are required."
        })
    }

    const borrowerResult = await db.query(getBorrowerQuery, [borrower_id])
    if(borrowerResult.rowCount === 0) {
        return res.status(404).json({
            error: "Not Found",
            message: "Borrower not found."
        })
    }
    
    const bookResult = await db.query(getBookQuery, [book_id])
    if(bookResult.rowCount === 0) {
        return res.status(404).json({
            error: "Not Found",
            message: "Book not found."
        })
    }

    const existingBorrowingResult = await db.query(checkExistingBorrowingQuery, [book_id, borrower_id])
    if((existingBorrowingResult.rowCount as number) > 0) {
        return res.status(404).json({
            error: "Bad Request",
            message: "The borrower already has an unreturned borrowing of this book."
        })
    }

    const availableQuantity = bookResult.rows[0].available_quantity
    if(availableQuantity <= 0) {
        return res.status(400).json({
            error: "Bad Request",
            message: "Book is not available for checkout."
        })
    }
    
    const checkout_date = new Date()
    const due_date = new Date()
    due_date.setDate(checkout_date.getDate() + 14)

    const borrowResult = await db.query(checkoutBookQuery, [book_id, borrower_id, checkout_date, due_date])

    const updatedQuantityResult = await db.query(updateBookQuantityQuery, [-1, book_id])
    const updatedQuantity = updatedQuantityResult.rows[0].available_quantity

    res.status(201).json({
        message: "Book checked out successfully.",
        borrowing: borrowResult.rows[0],
        updatedQuantity
    })

  } catch (error: any) {

    console.log(`Error checking out book: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message
    })
    
  }
}
export default checkoutBook
