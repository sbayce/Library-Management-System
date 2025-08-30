import { Request, Response } from "express"
import prisma from "../../db"
import { getBooksSchema } from "../../schemas/book"
import { Prisma } from "@prisma/client"

/**
 * @param {Request} req - Query: { search?, page, limit }
 * @param {Response} res
 * @returns
 * 200 OK - {
 *   data: Book[],
 *   pagination: { total, page, limit, totalPages },
 *   message: "Books fetched successfully"
 * }
 */

export const getBooks = async (req: Request, res: Response) => {
  // Validate (search input, page, limit)
  const parsed = getBooksSchema.parse(req.query)
  const { search, page, limit } = parsed

  const skip = (page - 1) * limit

  // Apply search on fields (title, author, ISBN)
  const where: Prisma.BookWhereInput = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { author: { contains: search, mode: "insensitive" } },
          { isbn: { contains: search, mode: "insensitive" } },
        ],
      }
    : {}

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      skip,
      take: limit,
    }),
    prisma.book.count({ where }), // Total books in DB
  ])

  return res.status(200).json({
    data: books,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    message: "Books fetched successfully",
  })
}
