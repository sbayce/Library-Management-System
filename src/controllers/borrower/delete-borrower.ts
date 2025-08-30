import { Request, Response } from "express"
import prisma from "../../db"
import { NotFoundError } from "../../errors"

/**
 * @param {Request} req - Params: { borrowerId }
 * @param {Response} res
 * @returns
 * 200 OK
 * 404 Not Found - If the borrower with the specified ID doesn't exist
 */

export const deleteBorrower = async (req: Request, res: Response) => {
  const borrowerId = Number(req.params.borrowerId)

  const existingBorrower = await prisma.borrower.findUnique({
    where: {
      id: borrowerId,
    },
  })

  if (!existingBorrower) {
    throw new NotFoundError("Borrower with the specified ID doesn't exist")
  }

  await prisma.borrower.delete({
    where: {
      id: borrowerId,
    },
  })

  return res.status(200).json({
    message: "Borrower deleted successfuly",
  })
}
