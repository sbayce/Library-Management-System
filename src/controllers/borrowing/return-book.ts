import { Request, Response } from "express"

const returnBook = async (req: Request, res: Response) => {
  try {
    const { prisma } = req.context
    const {bookId, email} = req.body

    if(!bookId || !email){
        return res.status(400).json({
            error: "Bad Request",
            message: "bookId and email are required."
        })
    }
    const parsedBookId = parseInt(bookId, 10)
    if (isNaN(parsedBookId)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid bookId.",
      })
    }

    // Find the borrower by email
    const borrower = await prisma.borrower.findUnique({
        where: { email },
      })
  
      if (!borrower) {
        return res.status(404).json({
          error: "Not Found",
          message: "Borrower not found.",
        })
      }
      const borrowerId = borrower.id

    // Find the book by ID
    const book = await prisma.book.findUnique({
      where: { id: parsedBookId },
    });

    if (!book) {
      return res.status(404).json({
        error: "Not Found",
        message: "Book not found.",
      });
    }

    // Find the borrowing record
    const borrowing = await prisma.borrowing.findFirst({
        where: {
          bookId: parsedBookId,
          borrowerId,
          returnedDate: null, // Ensure that the book has not been returned yet
        },
      });
  
      if (!borrowing) {
        return res.status(404).json({
          error: "Not Found",
          message: "No active borrowing for this book and borrower, cannot return book.",
        });
      }
    
    const returnedDate = new Date()

     // Update the borrowing record with the return date
     const updatedBorrowing = await prisma.borrowing.update({
        where: { id: borrowing.id },
        data: { returnedDate },
      });
  
      // Update the book's available quantity
      const updatedBook = await prisma.book.update({
        where: { id: parsedBookId },
        data: { availableQuantity: book.availableQuantity + 1 },
      });

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
