import { Request, Response } from "express"
import {returnBookQuery, getBorrowerQuery, getBorrowingQuery, getBookQuery} from "../../queries/borrowing/return-book"
import updateBookQuantityQuery from "../../queries/borrowing/update-quantity"
import * as db from '../../database/index'

const returnBook = async (req: Request, res: Response) => {
  try {
    const {book_id, email} = req.body

    if(!book_id || !email){
        return res.status(400).json({
            error: "Bad Request",
            message: "book_id, and email are required."
        })
    }

    const borrowerResult = await db.query(getBorrowerQuery, [email])
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

    const borrower_id = borrowerResult.rows[0].id

    const borrowingResult = await db.query(getBorrowingQuery, [book_id, borrower_id])

    if(borrowingResult.rowCount === 0) {
        return res.status(404).json({
            error: "Not Found",
            message: "No borrowing record found for this book and borrower, cannot return book."
        })
    }
    
    const returned_date = new Date()

    const borrowResult = await db.query(returnBookQuery, [returned_date, book_id, borrower_id])

    const updatedQuantityResult = await db.query(updateBookQuantityQuery, [1, book_id])
    const updatedQuantity = updatedQuantityResult.rows[0].available_quantity

    res.status(200).json({
        message: "Book returned successfully.",
        borrowing: borrowResult.rows[0],
        updatedQuantity
    })

  } catch (error: any) {

    console.log(`Error returning book: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message
    })
    
  }
}
export default returnBook
