import { Request, Response } from "express"
import updateBookQuery from "../../queries/book/update-book"
import * as db from '../../database/index'

const updateBook = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params
    const {title, author, isbn, available_quantity, shelf_location} = req.body

    if(!bookId){
        return res.status(400).json({
            error: "Bad Request",
            message: "Book ID is required."
        })
    }

    if(!title && !author && !isbn && available_quantity === undefined && !shelf_location){
        return res.status(400).json({
            error: "Bad Request",
            message: "No fields where provided to update."
        })
    }
    if(available_quantity !== undefined) {
        const quantity = parseInt(available_quantity, 10)
        if(isNaN(quantity)){
            return res.status(400).json({
                error: "Bad Request",
                message: "Available quantity is invalid."
            })
        }
        if(quantity < 0){
            console.log(quantity)
            return res.status(400).json({
                error: "Bad Request",
                message: "Available quantity should not be a negative value."
            })
        }
    }
    
    const result = await db.query(updateBookQuery, [title, author, isbn, available_quantity, shelf_location, bookId])

    if(result.rowCount === 0) {
        return res.status(404).json({
            error: "Not Found",
            message: "Book not found."
        })
    }

    res.status(200).json({
        message: "Book updated successfully.",
        updatedBook: result.rows[0]
    })

  } catch (error: any) {

    console.log(`Error updating book: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message
    })
    
  }
}
export default updateBook
