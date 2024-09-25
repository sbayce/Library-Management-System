import { Request, Response } from "express"

/**
 * @function deleteBook
 * @description Deletes a book from the database by its ID. Ensures the book ID is valid and handles cases where the book to be deleted does not exist.
 * 
 * @param {Request} req - The Express request object. Contains:
 *   - `req.params.bookId`: The ID of the book to be deleted.
 * @param {Response} res - The Express response object. Used to return:
 *   - A JSON response indicating successful deletion or
 *   - An error message if a server error occurs or the book is not found.
 * 
 * @returns {void} Returns a JSON response with:
 *   - `message`: A success message confirming the deletion of the book.
 *   - `deletedBook`: The details of the deleted book, if successfully deleted.
 */

const deleteBook = async (req: Request, res: Response) => {
  try {
    const { prisma } = req.context
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

    const deletedBook = await prisma.book.delete({
      where: {
        id
      }
    })

    res.status(200).json({
        message: "Book deleted successfully.",
        deletedBook
    })

  } catch (error: any) {
    if (error.code === "P2025") {
      // Error code for "Record to delete does not exist"
      return res.status(404).json({
        error: "Not Found",
        message: "Book not found.",
      })
    }
    console.log(`Error deleting book: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message
    })
    
  }
}
export default deleteBook
