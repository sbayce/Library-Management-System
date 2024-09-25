import { Request, Response } from "express"

const addBook = async (req: Request, res: Response) => {
  try {
    const { prisma } = req.context
    const {title, author, isbn, availableQuantity, shelfLocation} = req.body

    if(!title || !author || !isbn || availableQuantity === undefined || !shelfLocation){
        return res.status(400).json({
            error: "Bad Request",
            message: "Title, author, ISBN, available quantity and shelf location are required."
        })
    }
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

    const existingBook = await prisma.book.findUnique({
      where: {
        isbn
      }
    });

    if (existingBook) {
      return res.status(409).json({
        error: "Conflict",
        message: "A book with this ISBN already exists."
      });
    }

    const newBook = await prisma.book.create({
      data: {
        title, author, isbn, availableQuantity, shelfLocation
      }
    })

    res.status(201).json({
        message: "Book added successfully.",
        book: newBook
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
