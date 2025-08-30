import { Request, Response } from "express"
import prisma from "../../db"
import { paginationSchema } from "../../schemas/pagination"

/**
 * @param {Request} req - Body: { email, name }
 * @param {Response} res
 * @returns
 * 201 Created
 * 400 Bad Request - If a borrower with the given email already exists
 */

export const getActiveBorrowings = async (req: Request, res: Response) => {
  const parsed = paginationSchema.parse(req.query)
  const { page, limit } = parsed

  const skip = (page - 1) * limit

  const [borrowings, total] = await Promise.all([
    prisma.borrowing.findMany({
      skip,
      take: limit,
      where: {
        returnedDate: null,
      },
      include: {
        book: true,
        borrower: true,
      },
    }),
    prisma.borrowing.count({
      where: {
        returnedDate: null,
      },
    }),
  ])

  return res.status(200).json({
    data: borrowings,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    message: "Active borrowings fetched successfully",
  })
}
