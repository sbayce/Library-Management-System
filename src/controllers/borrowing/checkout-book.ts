import { Request, Response } from "express"

const REMAINING_DAYS = 14

/**
 * @function checkoutBook
 * @description Handles the checkout process for a book. This includes validating the input data, checking the existence of the borrower and book,
 *    ensuring the book is available, and creating a new borrowing record. The function also updates the book's available quantity and handles any potential errors.
 *    The dueDate is 14 days from the checkout (Variable 'REMAINING_DAYS')
 * 
 * @param {Request} req - The Express request object. Contains:
 *   - `req.body.bookId`: The ID of the book to be checked out.
 *   - `req.body.borrowerId`: The ID of the borrower who wants to check out the book.
 * @param {Response} res - The Express response object. Used to return:
 *   - A JSON response with a success message, borrowing record, and updated book quantity, or
 *   - An error message if validation fails or an internal server error occurs.
 * 
 * @returns {void} Returns a JSON response with the result of the checkout operation and any relevant data.
 */

const checkoutBook = async (req: Request, res: Response) => {
  try {
    const { prisma } = req.context
    const {bookId, borrowerId} = req.body

    if(!bookId || !borrowerId){
        return res.status(400).json({
            error: "Bad Request",
            message: "bookId and borrowerId are required."
        })
    }

    // Check if the borrower exists
    const borrower = await prisma.borrower.findUnique({
        where: { id: parseInt(borrowerId, 10) },
      })

      if (!borrower) {
        return res.status(404).json({
          error: "Not Found",
          message: "Borrower not found.",
        })
      }
    
    // Check if the book exists
    const book = await prisma.book.findUnique({
        where: { id: parseInt(bookId, 10) },
      })
  
      if (!book) {
        return res.status(404).json({
          error: "Not Found",
          message: "Book not found.",
        })
      }

    // Check if there is already an active borrowing for this book and borrower
    const existingBorrowing = await prisma.borrowing.findFirst({
        where: {
          bookId,
          borrowerId,
          returnedDate: null,
        },
      })
  
      if (existingBorrowing) {
        return res.status(400).json({
          error: "Bad Request",
          message: "The borrower already borrowed this book.",
        })
      }

    // Check if the book is available for checkout
    if (book.availableQuantity <= 0) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Book is not available for checkout.",
        })
      }
    
    const checkoutDate = new Date()
    const dueDate = new Date()
    dueDate.setDate(checkoutDate.getDate() + REMAINING_DAYS)

    // Create a new borrowing record
    const borrowing = await prisma.borrowing.create({
        data: {
          bookId,
          borrowerId,
          checkoutDate,
          dueDate,
        },
      })

    // Update the book's available quantity
    const updatedBook = await prisma.book.update({
        where: { id: bookId },
        data: { availableQuantity: book.availableQuantity - 1 },
      })

    res.status(201).json({
        message: "Book checked out successfully.",
        borrowing,
        updatedQuantity: updatedBook.availableQuantity
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
