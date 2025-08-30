import { Request, Response } from "express"
import prisma from "../../db"
import { paginationSchema } from "../../schemas/pagination"

/**
 * @param {Request} req - Query: { page, limit }
 * @param {Response} res
 * @returns
 * 200 OK - {
 *   data: Borrowing[],
 *   pagination: { total, page, limit, totalPages },
 *   message: "Overdue borrowings fetched successfully"
 * }
 * 400 Bad Request - If pagination query params are invalid
 */

export const getOverdueBooks = async (req: Request, res: Response) => {
  const parsed = paginationSchema.parse(req.query)
  const { page, limit } = parsed

  const skip = (page - 1) * limit

  const currentDate = new Date()

  const [borrowings, total] = await Promise.all([
    prisma.borrowing.findMany({
      skip,
      take: limit,
      where: {
        dueDate: {
          lt: currentDate,
        },
        returnedDate: null,
      },
      include: {
        book: true,
        borrower: true,
      },
    }),
    prisma.borrowing.count({
      where: {
        dueDate: {
          lt: currentDate,
        },
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
    message: "Overdue borrowings fetched successfully",
  })
}
