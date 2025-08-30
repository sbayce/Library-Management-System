import { Request, Response } from "express"
import prisma from "../../db"
import { BadRequestError } from "../../errors"

/**
 * @param {Request} req - Body: { email, name }
 * @param {Response} res
 * @returns
 * 201 Created - Borrower registered successfully
 * 400 Bad Request - Borrower with this email is already registered
 */

export const registerBorrower = async (req: Request, res: Response) => {
  const { email, name } = req.body

  // Check if borrower's email already exists
  const existingBorrower = await prisma.borrower.findUnique({
    where: {
      email,
    },
  })

  if (existingBorrower) {
    throw new BadRequestError("Borrower with this email is already registered")
  }

  const borrower = await prisma.borrower.create({
    data: {
      email,
      name,
    },
  })

  return res.status(201).json({
    data: borrower,
    message: "Borrower registered successfuly",
  })
}
