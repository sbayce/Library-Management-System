import { Request, Response } from "express"
import prisma from "../../db"
import { NotFoundError } from "../../errors"

/**
 * @param {Request} req - Params: { bookId }
 * @param {Response} res
 * @returns
 * 200 OK
 * 404 Not Found - If the book with the specified ID doesn't exist
 */

export const deleteBook = async (req: Request, res: Response) => {
  const bookId = Number(req.params.bookId)

  // Check if book exists
  const existingBook = await prisma.book.findUnique({
    where: {
      id: bookId,
    },
  })

  if (!existingBook) {
    throw new NotFoundError("Book with the specified ID doesn't exist")
  }

  await prisma.book.delete({
    where: {
      id: bookId,
    },
  })

  return res.status(200).json({
    message: "Book deleted successfuly",
  })
}
