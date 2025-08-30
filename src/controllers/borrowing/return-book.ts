import { Request, Response } from "express"
import prisma from "../../db"
import { NotFoundError } from "../../errors"

/**
 * @param {Request} req - Body: { bookId, borrowerId }
 * @param {Response} res
 * @returns
 * 200 OK
 * 404 Not Found - If the book, borrower, or active borrowing record doesn't exist
 */

export const returnBook = async (req: Request, res: Response) => {
  const { bookId, borrowerId } = req.body

  // Begin a transaction
  await prisma.$transaction(async (tx) => {
    // Validate book exists
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

    // Validate borrower exists
    const existingBorrower = await tx.borrower.findUnique({
      where: {
        id: borrowerId,
      },
    })

    if (!existingBorrower) {
      throw new NotFoundError("Borrower specified doesn't exist")
    }

    // Validate that the borrowing exists and hasn't been returned yet
    const existingBorrowing = await prisma.borrowing.findFirst({
      where: {
        bookId,
        borrowerId,
        returnedDate: null,
      },
    })

    if (!existingBorrowing) {
      throw new NotFoundError(
        "No active borrowing for this book and borrower, cannot return book"
      )
    }

    const returnedDate = new Date()

    // Mark the return date
    await tx.borrowing.update({
      where: {
        id: existingBorrowing.id,
      },
      data: {
        returnedDate,
      },
    })

    // Increment the book's available quantity
    await tx.book.update({
      where: {
        id: bookId,
      },
      data: {
        availableQuantity: {
          increment: 1,
        },
      },
    })
  })

  return res.status(200).json({
    message: "Book returned successfuly",
  })
}
