import { Request, Response } from "express"
import prisma from "../../db"
import { BadRequestError, NotFoundError } from "../../errors"

/**
 * @param {Request} req - Params: { bookId }, Body: { title, author, isbn, availableQuantity, shelfLocation }
 * @param {Response} res
 * @returns
 * 200 OK
 * 400 Bad Request - If a book with the same ISBN already exists
 * 404 Not Found - If the book with the specified ID doesn't exist
 */

export const updateBook = async (req: Request, res: Response) => {
  const { title, author, availableQuantity, isbn, shelfLocation } = req.body
  const bookId = Number(req.params.bookId)

  // Check if books exists
  const existingBook = await prisma.book.findUnique({
    where: {
      id: bookId,
    },
  })

  if (!existingBook) {
    throw new NotFoundError("Book with the specified ID doesn't exist")
  }

  // Check if the ISBN already exists
  const existingIsbn = await prisma.book.findUnique({
    where: {
      isbn,
      NOT: {
        id: bookId,
      },
    },
  })

  if (existingIsbn) {
    throw new BadRequestError("Book with this ISBN already exists")
  }

  const book = await prisma.book.update({
    where: {
      id: bookId,
    },
    data: {
      title,
      author,
      availableQuantity,
      shelfLocation,
      isbn,
    },
  })

  return res.status(200).json({
    data: book,
    message: "Book updated successfuly",
  })
}
