import { Request, Response } from "express"
import searchBooksQuery from "../../queries/book/search-books"
import * as db from '../../database/index'

const searchBooks = async (req: Request, res: Response) => {
  try {
    const {title, author, isbn} = req.query

    const result = await db.query(searchBooksQuery, [title || null, author || null, isbn || null])

    res.status(200).json(result.rows)

  } catch (error: any) {

    console.log(`Error searching books: ${error.message}`)
    
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    })

  }
}
export default searchBooks
