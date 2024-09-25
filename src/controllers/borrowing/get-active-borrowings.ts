import { Request, Response } from "express"

/**
 * @function getActiveBorrowings
 * @description Retrieves a paginated list of active borrowings from the database. This function returns borrowings
 * that have not yet been returned (i.e., `returnedDate` is `null`). It supports pagination via query parameters
 * (`page` and `pageSize`) to fetch borrowings in a paginated format.
 * 
 * @param {Request} req - The Express request object, which contains query parameters for pagination (`page`, `pageSize`).
 * @param {Response} res - The Express response object, used to return the paginated list of active borrowings or handle errors.
 * 
 * @returns {void} Returns a JSON response with the list of active borrowings, pagination details, and a message.
 */

const getActiveBorrowings = async (req: Request, res: Response) => {
  try {
    const { prisma } = req.context

    // Query parameters for pagination
    const page = parseInt(req.query.page as string, 10) || 1 // Default to page 1
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10 // Default to 10 items per page

    // Calculate the starting index for the query
    const skip = (page - 1) * pageSize

    // Fetch paginated active borrowings where returnedDate is null
    const activeBorrowings = await prisma.borrowing.findMany({
      where: { returnedDate: null },
      include: {
        book: true,        // Include book details
        borrower: true,    // Include borrower details
      },
      skip,
      take: pageSize,
    })

    const totalActiveBorrowings = await prisma.borrowing.count({
      where: { returnedDate: null },
    })
    const totalPages = Math.ceil(totalActiveBorrowings / pageSize)

    res.status(200).json({
      message: "Current active borrowings",
      activeBorrowings,
      pagination: {
        currentPage: page,
        pageSize,
        totalPages,
        totalActiveBorrowings,
      },
    })

  } catch (error: any) {
    console.log(`Error fetching active borrowings: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    })
  }
}

export default getActiveBorrowings
