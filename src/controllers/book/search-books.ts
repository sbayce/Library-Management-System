import { Request, Response } from "express"

const searchBooks = async (req: Request, res: Response) => {
  try {
    const { prisma } = req.context
    const {title, author, isbn} = req.query

    const titleFilter = typeof title === 'string' ? title : undefined
    const authorFilter = typeof author === 'string' ? author : undefined
    const isbnFilter = typeof isbn === 'string' ? isbn : undefined

    const whereConditions: any = {
      AND: [
        titleFilter ? { title: { contains: titleFilter, mode: 'insensitive' } } : {},
        authorFilter ? { author: { contains: authorFilter, mode: 'insensitive' } } : {},
        isbnFilter ? { isbn: { contains: isbnFilter, mode: 'insensitive' } } : {}
      ].filter(condition => Object.keys(condition).length > 0) // Remove empty objects
    }

    const books = await prisma.book.findMany({
      where: whereConditions
    });

    res.status(200).json(books)

  } catch (error: any) {

    console.log(`Error searching books: ${error.message}`)
    
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    })

  }
}
export default searchBooks
