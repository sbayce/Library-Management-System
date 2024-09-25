import { Request, Response } from "express"

/**
 * @function searchBooks
 * @description This function allows users to search for books in the database based on filters like title, author, or ISBN.
 * It supports pagination to efficiently return results for large datasets.
 * 
 * @param {Request} req - The Express request object, which contains query parameters for search filters (title, author, isbn) and pagination (page, pageSize).
 * @param {Response} res - The Express response object, which is used to return the search results along with pagination data.
 * 
 * @returns {void} Returns a JSON response containing a list of books matching the search criteria and pagination details.
 */

const searchBooks = async (req: Request, res: Response) => {
  try {
    const { prisma } = req.context
    const { title, author, isbn } = req.query

    // Build filter conditions for the Prisma query based on the presence of query parameters
    // Use case-insensitive search (mode: 'insensitive') for better user experience
    const titleFilter = typeof title === "string" ? title : undefined
    const authorFilter = typeof author === "string" ? author : undefined
    const isbnFilter = typeof isbn === "string" ? isbn : undefined

    // Combine filter conditions using the AND operator, ignoring undefined filters
    const whereConditions: any = {
      AND: [
        titleFilter ? { title: { contains: titleFilter, mode: "insensitive" } } : {},
        authorFilter ? { author: { contains: authorFilter, mode: "insensitive" } } : {},
        isbnFilter ? { isbn: { contains: isbnFilter, mode: "insensitive" } } : {},
      ].filter((condition) => Object.keys(condition).length > 0), // Remove empty objects
    }

    // Query parameters for pagination
    const page = parseInt(req.query.page as string, 10) || 1 // Default to page 1
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10 // Default to 10 items per page
    const skip = (page - 1) * pageSize

    // Fetch paginated books
    const books = await prisma.book.findMany({
      where: whereConditions,
      skip,
      take: pageSize,
    })

    const totalBooks = await prisma.book.count({
      where: whereConditions,
    })

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
    console.log(`Error searching books: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    })
  }
}

export default searchBooks
