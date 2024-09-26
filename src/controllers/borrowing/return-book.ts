import { Request, Response } from "express"

/**
 * @function returnBook
 * @description Handles the process of returning a borrowed book. This includes validating the input data,
 *    checking the existence of the borrower and book, finding the active borrowing record,
 *    updating the borrowing record with the return date, and updating the book's available quantity.
 * 
 * @param {Request} req - The Express request object. Contains:
 *   - `req.body.bookId`: The ID of the book being returned.
 *   - `req.body.borrowerId`: The id of the borrower returning the book.
 * @param {Response} res - The Express response object. Used to return:
 *   - A JSON response with a success message, updated borrowing record, and updated book quantity, or
 *   - An error message if validation fails or an internal server error occurs.
 * 
 * @returns {void} Returns a JSON response with the result of the return operation and any relevant data.
 */

const returnBook = async (req: Request, res: Response) => {
  try {
    const { prisma } = req.context
    const {bookId, borrowerId} = req.body

    if(!bookId || !borrowerId){
        return res.status(400).json({
            error: "Bad Request",
            message: "bookId and borrowerId are required."
        })
    }
    const parsedBookId = parseInt(bookId, 10)
    if (isNaN(parsedBookId)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid bookId.",
      })
    }

    const parsedBorrowerId = parseInt(borrowerId, 10)
    if (isNaN(parsedBorrowerId)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid borrowerId.",
      })
    }

    // Check if borrower exists
    const borrower = await prisma.borrower.findUnique({
        where: { id: parsedBorrowerId },
      })
  
      if (!borrower) {
        return res.status(404).json({
          error: "Not Found",
          message: "Borrower not found.",
        })
      }

    // Find the book by ID
    const book = await prisma.book.findUnique({
      where: { id: parsedBookId },
    })

    if (!book) {
      return res.status(404).json({
        error: "Not Found",
        message: "Book not found.",
      })
    }

    // Find the borrowing record
    const borrowing = await prisma.borrowing.findFirst({
        where: {
          bookId: parsedBookId,
          borrowerId: parsedBorrowerId,
          returnedDate: null, // Ensure that the book has not been returned yet
        },
      })
  
      if (!borrowing) {
        return res.status(404).json({
          error: "Not Found",
          message: "No active borrowing for this book and borrower, cannot return book.",
        })
      }
    
    const returnedDate = new Date()

     // Update the borrowing record with the return date
     const updatedBorrowing = await prisma.borrowing.update({
        where: { id: borrowing.id },
        data: { returnedDate },
      })
  
      // Update the book's available quantity
      const updatedBook = await prisma.book.update({
        where: { id: parsedBookId },
        data: { availableQuantity: book.availableQuantity + 1 },
      })

    res.status(200).json({
        message: "Book returned successfully.",
        updatedBorrowing,
        updatedQuantity: updatedBook.availableQuantity
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
