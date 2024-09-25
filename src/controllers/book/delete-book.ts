import { Request, Response } from "express"

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
      });
    }
    console.log(`Error deleting book: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message
    })
    
  }
}
export default deleteBook
