import { Request, Response } from "express"
import prisma from "../../db"
import { BadRequestError, NotFoundError } from "../../errors"

/**
 * @param {Request} req - Body: { bookId: number, borrowerId: number, dueDate }
 * @param {Response} res
 * @returns
 * 201 Created
 * 400 Bad Request - Borrower already borrowed this book OR Book has no available copies
 * 404 Not Found - Book or Borrower with the specified ID doesn't exist
 */

export const checkoutBook = async (req: Request, res: Response) => {
  const { bookId, borrowerId, dueDate } = req.body

  // Begin a transaction
  const borrowing = await prisma.$transaction(async (tx) => {
    const existingBook = await tx.book.findUnique({
      where: {
        id: bookId,
      },
      select: {
        availableQuantity: true,
      },
    })

    if (!existingBook) {
      throw new NotFoundError("Book specified doesn't exist")
    }

    const existingBorrower = await tx.borrower.findUnique({
      where: {
        id: borrowerId,
      },
    })

    if (!existingBorrower) {
      throw new NotFoundError("Borrower specified doesn't exist")
    }

    const existingBorrowing = await tx.borrowing.findFirst({
      where: {
        bookId,
        borrowerId,
        returnedDate: null,
      },
    })

    if (existingBorrowing) {
      throw new BadRequestError("This borrower already borrowed this book")
    }

    if (existingBook.availableQuantity <= 0) {
      throw new BadRequestError("Book has no available copies")
    }

    const borrowing = await tx.borrowing.create({
      data: {
        bookId,
        borrowerId,
        checkoutDate: new Date(),
        dueDate: new Date(dueDate),
      },
    })

    await tx.book.update({
      where: {
        id: bookId,
      },
      data: {
        availableQuantity: {
          decrement: 1,
        },
      },
    })

    return borrowing
  })

  return res.status(201).json({
    data: borrowing,
    message: "Checkout created successfuly",
  })
}
