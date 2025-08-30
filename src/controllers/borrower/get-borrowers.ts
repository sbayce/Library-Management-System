import { Request, Response } from "express"
import prisma from "../../db"
import { paginationSchema } from "../../schemas/pagination"

/**
 * @param {Request} req - Query: { page, limit }
 * @param {Response} res
 * @returns
 * 200 OK - {
 *   data: Borrower[],
 *   pagination: { total, page, limit, totalPages },
 *   message: "Borrowers fetched successfully"
 * }
 */

export const getBorrowers = async (req: Request, res: Response) => {
  const parsed = paginationSchema.parse(req.query)
  const { page, limit } = parsed

  const skip = (page - 1) * limit

  const [borrowers, total] = await Promise.all([
    prisma.borrower.findMany({
      skip,
      take: limit,
    }),
    prisma.borrower.count(),
  ])

  return res.status(200).json({
    data: borrowers,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    message: "Borrowers fetched successfully",
  })
}
