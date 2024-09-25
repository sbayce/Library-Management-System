import { Request, Response } from "express"

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
