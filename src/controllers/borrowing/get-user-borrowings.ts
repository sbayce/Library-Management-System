import { Request, Response } from "express"
import prisma from "../../db"
import { paginationSchema } from "../../schemas/pagination"

/**
 * @param {Request} req - Params: { borrowerId }, Query: { page, limit }
 * @param {Response} res
 * @returns
 * 200 OK - {
 *   data: borrowings[],
 *   pagination: { total, page, limit, totalPages },
 *   message: "User's borrowings fetched successfully"
 * }
 * 400 Bad Request - If pagination query params are invalid
 */

export const getUserBorrowings = async (req: Request, res: Response) => {
  const borrowerId = Number(req.params.borrowerId)
  const parsed = paginationSchema.parse(req.query)
  const { page, limit } = parsed

  const skip = (page - 1) * limit

  const [borrowings, total] = await Promise.all([
    prisma.borrowing.findMany({
      skip,
      take: limit,
      where: {
        borrowerId,
        returnedDate: null,
      },
      select: {
        checkoutDate: true,
        dueDate: true,
        book: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    }),
    prisma.borrowing.count({
      where: {
        borrowerId,
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
    message: "User's borrowings fetched successfully",
  })
}
