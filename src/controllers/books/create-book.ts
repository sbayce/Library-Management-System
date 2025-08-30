import { Request, Response } from "express"
import prisma from "../../db"
import { BadRequestError } from "../../errors"

/**
 * @param {Request} req - Body: { title, author, isbn, availableQuantity }
 * @param {Response} res
 * @returns
 * 201 Created
 * 400 Bad Request - If a book with the same ISBN already exists
 */

export const createBook = async (req: Request, res: Response) => {
  const { title, author, isbn, availableQuantity, shelfLocation } = req.body

  // Check if ISBN already exists
  const existingBook = await prisma.book.findUnique({
    where: {
      isbn,
    },
  })

  if (existingBook) {
    throw new BadRequestError("Book with this ISBN already exists")
  }

  const book = await prisma.book.create({
    data: {
      title,
      author,
      isbn,
      availableQuantity,
      shelfLocation,
    },
  })

  return res.status(201).json({
    data: book,
    message: "Book created successfuly",
  })
}
