import { Request, Response } from "express"
import addBookQuery from "../../queries/book/add-book"
import * as db from '../../database/index'

const addBook = async (req: Request, res: Response) => {
  try {
    const {title, author, isbn, available_quantity, shelf_location} = req.body
    if(!title || !author || !isbn || available_quantity === undefined || !shelf_location){
        return res.status(400).json({
            error: "Bad Request",
            message: "Title, author, ISBN, available quantity and shelf location are required."
        })
    }
    const quantity = parseInt(available_quantity, 10)
    if(isNaN(quantity) || quantity < 0){
        console.log("quantity: ", quantity)
        return res.status(400).json({
            error: "Bad Request",
            message: "Available quantity should not be a negative value."
        })
    }
    
    const result = await db.query(addBookQuery, [title, author, isbn, quantity, shelf_location])

    res.status(201).json({
        message: "Book added successfully.",
        book: result.rows[0]
    })

  } catch (error: any) {

    console.log(`Error adding book: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message
    })
    
  }
}
export default addBook
