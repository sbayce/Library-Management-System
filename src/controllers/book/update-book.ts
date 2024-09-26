import { Request, Response } from "express"

/**
 * @function updateBook
 * @description Handles the update of a book's details in the database. Validates the provided book ID and update fields, then performs the update operation.
 * 
 * @param {Request} req - The Express request object. Contains:
 *   - `req.params.bookId`: The ID of the book to update.
 *   - `req.body`: The fields to update in the book record (e.g., title, author, ISBN, availableQuantity, shelfLocation).
 * @param {Response} res - The Express response object. Used to return:
 *   - A JSON response with a success message and the updated book record, or
 *   - An error message if the book ID is invalid, if no fields are provided to update, if the available quantity is invalid, or if a server error occurs.
 * 
 * @returns {void} Returns a JSON response with the result of the update operation and any relevant data.
 */

const updateBook = async (req: Request, res: Response) => {
  try {
    const { prisma } = req.context
    const { bookId } = req.params
    const {title, author, isbn, availableQuantity, shelfLocation} = req.body

    if(!bookId){
        return res.status(400).json({
            error: "Bad Request",
            message: "Book ID is required."
        })
    }

    if(!title && !author && !isbn && availableQuantity === undefined && !shelfLocation){
        return res.status(400).json({
            error: "Bad Request",
            message: "No fields where provided to update."
        })
    }
    if(availableQuantity !== undefined) {
        const quantity = parseInt(availableQuantity, 10)
        if(isNaN(quantity)){
            return res.status(400).json({
                error: "Bad Request",
                message: "Available quantity is invalid."
            })
        }
        if(quantity < 0){
            return res.status(400).json({
                error: "Bad Request",
                message: "Available quantity should not be a negative value."
            })
        }
    }

    const updateData: any = {}
    if (title) updateData.title = title
    if (author) updateData.author = author
    if (isbn) updateData.isbn = isbn
    if (availableQuantity !== undefined) updateData.availableQuantity = availableQuantity
    if (shelfLocation) updateData.shelfLocation = shelfLocation
    
    const updatedBook = await prisma.book.update({
        where: { id: parseInt(bookId, 10) },
        data: updateData,
      })

    res.status(200).json({
        message: "Book updated successfully.",
        updatedBook
    })

  } catch (error: any) {
    if (error.code === 'P2025') {
        // Error code for "Record to delete does not exist"
        return res.status(404).json({
          error: "Not Found",
          message: "Book not found.",
        })
      }
    console.log(`Error updating book: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message
    })
    
  }
}
export default updateBook
