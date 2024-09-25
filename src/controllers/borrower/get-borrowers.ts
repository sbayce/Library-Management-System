import { Request, Response } from "express"

/**
 * @function getBorrowers
 * @description Retrieves a paginated list of borrowers from the database. This function supports pagination via 
 * query parameters (`page` and `pageSize`) to fetch borrowers in a paginated format.
 * 
 * @param {Request} req - The Express request object, which contains query parameters for pagination (page, pageSize).
 * @param {Response} res - The Express response object, used to return the paginated borrower data or handle errors.
 * 
 * @returns {void} Returns a JSON response with an array of borrowers and pagination details.
 */

const getBorrowers = async (req: Request, res: Response) => {
  try {
    const { prisma } = req.context

    // Query parameters for pagination
    const page = parseInt(req.query.page as string, 10) || 1 // Default to page 1
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10 // Default to 10 items per page

    // Calculate the starting index for the query
    const skip = (page - 1) * pageSize

    // Fetch paginated borrowers
    const borrowers = await prisma.borrower.findMany({
      skip,
      take: pageSize,
    })

    const totalBorrowers = await prisma.borrower.count()
    const totalPages = Math.ceil(totalBorrowers / pageSize)

    res.status(200).json({
      borrowers,
      pagination: {
        currentPage: page,
        pageSize,
        totalPages,
        totalBorrowers,
      },
    })
  } catch (error: any) {
    console.log(`Error fetching borrowers: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    })
  }
}

export default getBorrowers
