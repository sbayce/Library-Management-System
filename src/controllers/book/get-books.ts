import { Request, Response } from "express"
import getBooksQuery from "../../queries/book/get-books"
import * as db from '../../database/index'

const getBooks = async (req: Request, res: Response) => {
  try {
    const result = await db.query(getBooksQuery)

    res.status(200).json(result.rows)

  } catch (error: any) {

    console.log(`Error fetching books: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message
    })
    
  }
}
export default getBooks
