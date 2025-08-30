import { Request, Response } from "express"
import prisma from "../../db"
import { BadRequestError, NotFoundError } from "../../errors"

/**
 * @param {Request} req
 *   - Params: { borrowerId: number }
 *   - Body: { email: string, name: string }
 * @param {Response} res
 * @returns
 * 200 OK
 * 400 Bad Request - Borrower with this email already exists
 * 404 Not Found - Borrower with the specified ID doesn't exist
 */

export const updateBorrower = async (req: Request, res: Response) => {
  const { email, name } = req.body
  const borrowerId = Number(req.params.borrowerId)

  // Check if borrower exists
  const existingBorrower = await prisma.borrower.findUnique({
    where: {
      id: borrowerId,
    },
  })

  if (!existingBorrower) {
    throw new NotFoundError("Borrower with the specified ID doesn't exist")
  }

  // Check if borrower's email already exists
  const existingEmail = await prisma.borrower.findUnique({
    where: {
      email,
      NOT: {
        id: borrowerId,
      },
    },
  })

  if (existingEmail) {
    throw new BadRequestError("Borrower with this email already exists")
  }

  const borrower = await prisma.borrower.update({
    where: {
      id: borrowerId,
    },
    data: {
      email,
      name,
    },
  })

  return res.status(200).json({
    data: borrower,
    message: "Borrower updated successfuly",
  })
}
