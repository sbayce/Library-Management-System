import { Request, Response } from "express"

const getUserBorrowings = async (req: Request, res: Response) => {
  try {
    const { prisma } = req.context
    const { borrowerId } = req.body

    // Validate the borrower ID
    if (!borrowerId) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Borrower ID is required.",
        })
    }

    const parsedId = parseInt(borrowerId, 10)
    if (isNaN(parsedId)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid borrower ID.",
      })
    }

    // Fetch books currently checked out by the borrower where returnedDate is null
    const borrowedBooks = await prisma.borrowing.findMany({
        where: {
          borrowerId: parsedId,
          returnedDate: null,
        },
        include: {
          book: true,        // Include book details
        },
    })
  
    if (borrowedBooks.length === 0) {
        return res.status(404).json({
          message: "You are currently not borrowing any book.",
        })
    }

    res.status(200).json({
        message: "Borrowed books",
        borrowedBooks,
    })

  } catch (error: any) {
    console.log(`Error fetching borrowed books: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message
    })
    
  }
}
export default getUserBorrowings
