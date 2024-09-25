import { Request, Response } from "express"

/**
 * @function getOverdueBooks
 * @description Retrieves a paginated list of overdue books from the database. Overdue books are those whose due date
 * has passed and have not yet been returned. This function supports pagination via query parameters (`page` and `pageSize`).
 * 
 * @param {Request} req - The Express request object, which contains query parameters for pagination (`page`, `pageSize`).
 * @param {Response} res - The Express response object, used to return the paginated list of overdue books or handle errors.
 * 
 * @returns {void} Returns a JSON response with the list of overdue books, pagination details, and a message.
 */

const getOverdueBooks = async (req: Request, res: Response) => {
  try {
    const { prisma } = req.context
    const currentDate = new Date()

    // Query parameters for pagination
    const page = parseInt(req.query.page as string, 10) || 1 // Default to page 1
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10 // Default to 10 items per page

    // Calculate the starting index for the query
    const skip = (page - 1) * pageSize

    const overdueBorrowings = await prisma.borrowing.findMany({
      where: {
        dueDate: {
          lt: currentDate, // Due date is before the current date
        },
        returnedDate: null, // Book has not been returned
      },
      include: {
        book: true, // Include book details
        borrower: true, // Include borrower details
      },
      skip,
      take: pageSize,
    })

    const totalOverdueBooks = await prisma.borrowing.count({
      where: {
        dueDate: {
          lt: currentDate,
        },
        returnedDate: null,
      },
    })

    const totalPages = Math.ceil(totalOverdueBooks / pageSize)

    if (overdueBorrowings.length === 0) {
      return res.status(404).json({
        message: "No overdue books found.",
      })
    }

    res.status(200).json({
      message: "Overdue books",
      overdueBooks: overdueBorrowings,
      pagination: {
        currentPage: page,
        pageSize,
        totalPages,
        totalOverdueBooks,
      },
    })

  } catch (error: any) {
    console.log(`Error fetching overdue books: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    })
  }
}

export default getOverdueBooks
