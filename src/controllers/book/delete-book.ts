import { Request, Response } from "express"
import deleteBookQuery from "../../queries/book/delete-book"
import * as db from '../../database/index'

const deleteBook = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params

    if(!bookId){
        return res.status(400).json({
            error: "Bad Request",
            message: "Book ID is required."
        })
    }

    const id = parseInt(bookId, 10)
    if(isNaN(id)) {
        return res.status(400).json({
            error: "Bad Request",
            message: "Invalid book ID."
        })
    }

    const result = await db.query(deleteBookQuery, [bookId])

    if(result.rowCount === 0){
        return res.status(404).json({
            error: "Not Found",
            message: "Book not found."
        })
    }
    res.status(200).json({
        message: "Book deleted successfully.",
        deletedBook: result.rows[0]
    })

  } catch (error: any) {

    console.log(`Error deleting book: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message
    })
    
  }
}
export default deleteBook
