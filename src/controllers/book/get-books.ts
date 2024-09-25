import { Request, Response } from "express"

/**
 * @function getBooks
 * @description Retrieves a paginated list of books from the database. Supports pagination through query parameters to handle large datasets efficiently.
 * 
 * @param {Request} req - The Express request object. Contains:
 *   - `req.query.page`: The page number to retrieve (default is 1).
 *   - `req.query.pageSize`: The number of books per page (default is 10).
 * @param {Response} res - The Express response object. Used to return:
 *   - A JSON response with the list of books and pagination details, or
 *   - An error message if a server error occurs.
 * 
 * @returns {void} Returns a JSON response with:
 *   - `books`: The list of books for the current page.
 *   - `pagination`: An object containing:
 *     - `currentPage`: The current page number.
 *     - `pageSize`: The number of books per page.
 *     - `totalPages`: The total number of pages.
 *     - `totalBooks`: The total number of books.
 */

const getBooks = async (req: Request, res: Response) => {
  try {
    const { prisma } = req.context

    // Query parameters for pagination
    const page = parseInt(req.query.page as string, 10) || 1 // Default = 1
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10 // Default = 10 books per page

    // Calculate the starting index for the query
    const skip = (page - 1) * pageSize

    // Fetch paginated books
    const books = await prisma.book.findMany({
      skip,
      take: pageSize,
    })

    const totalBooks = await prisma.book.count()
    const totalPages = Math.ceil(totalBooks / pageSize)

    res.status(200).json({
      books,
      pagination: {
        currentPage: page,
        pageSize,
        totalPages,
        totalBooks,
      },
    })

  } catch (error: any) {

    console.log(`Error fetching books: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message
    })
    
  }
}
export default getBooks
