import { Request, Response } from "express"

/**
 * @function getUserBorrowings
 * @description Retrieves a paginated list of books currently borrowed by a specific borrower.
 *    The function validates the borrower ID provided in the request body and supports pagination via query parameters (`page` and `pageSize`).
 * 
 * @param {Request} req - The Express request object. Contains:
 *   - `req.body.borrowerId`: The ID of the borrower whose borrowed books are to be retrieved.
 *   - `req.query.page`: The page number to fetch (defaults to 1 if not provided).
 *   - `req.query.pageSize`: The number of books per page (defaults to 10 if not provided).
 * @param {Response} res - The Express response object. Used to return:
 *   - A JSON response with the list of borrowed books and pagination details, or
 *   - An error message if validation fails or an internal server error occurs.
 * 
 * @returns {void} Returns a JSON response with the list of borrowed books, pagination information, and a message.
 */

const getUserBorrowings = async (req: Request, res: Response) => {
  try {
    const { prisma } = req.context
    const { borrowerId } = req.params

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

    // Query parameters for pagination
    const page = parseInt(req.query.page as string, 10) || 1 // Default to page 1
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10 // Default to 10 items per page

    // Calculate the starting index for the query
    const skip = (page - 1) * pageSize

    // Fetch paginated books currently checked out by the borrower
    const borrowedBooks = await prisma.borrowing.findMany({
      where: {
        borrowerId: parsedId,
        returnedDate: null,
      },
      include: {
        book: true, // Include book details
      },
      skip,
      take: pageSize,
    })

    const totalBorrowedBooks = await prisma.borrowing.count({
      where: {
        borrowerId: parsedId,
        returnedDate: null,
      },
    })

    const totalPages = Math.ceil(totalBorrowedBooks / pageSize)

    if (borrowedBooks.length === 0) {
      return res.status(404).json({
        message: "You are currently not borrowing any book.",
      })
    }

    res.status(200).json({
      message: "Borrowed books",
      borrowedBooks,
      pagination: {
        currentPage: page,
        pageSize,
        totalPages,
        totalBorrowedBooks,
      },
    })

  } catch (error: any) {
    console.log(`Error fetching borrowed books: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    })
  }
}

export default getUserBorrowings
