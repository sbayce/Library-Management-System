import { Request, Response } from "express"

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

    // update data
    const updateData: any = {};
    if (title) updateData.title = title;
    if (author) updateData.author = author;
    if (isbn) updateData.isbn = isbn;
    if (availableQuantity !== undefined) updateData.availableQuantity = availableQuantity;
    if (shelfLocation) updateData.shelfLocation = shelfLocation;
    
    const updatedBook = await prisma.book.update({
        where: { id: parseInt(bookId, 10) },
        data: updateData,
      });

    res.status(200).json({
        message: "Book updated successfully.",
        updatedBook
    })

  } catch (error: any) {
    if (error.code === 'P2025') {
        // Book not found
        return res.status(404).json({
          error: "Not Found",
          message: "Book not found.",
        });
      }
    console.log(`Error updating book: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message
    })
    
  }
}
export default updateBook
