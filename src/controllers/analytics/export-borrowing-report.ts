import { Request, Response } from "express"
import prisma from "../../db"
import { NotFoundError } from "../../errors"
import { json2csv } from "json-2-csv"
import path from "path"
import fs from "fs"

/**
 * @param {Request} req - Query: { startDate, endDate }
 * @param {Response} res
 * @returns
 * 200 OK - CSV file download containing borrowings in the specified date range
 * 404 Not Found - If no borrowings exist for the specified date range
 */

export const exportBorrowingReport = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query

  const borrowings = await prisma.borrowing.findMany({
    where: {
      checkoutDate: {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      },
    },
    include: {
      book: true,
      borrower: true,
    },
  })

  if (borrowings.length === 0) {
    throw new NotFoundError("No borrowings found for the specified date range")
  }

  const csvData = borrowings.map((borrowing) => ({
    "Book Title": borrowing.book.title,
    "Borrower Name": borrowing.borrower.name,
    "Borrower Email": borrowing.borrower.email,
    "Checkout Date": borrowing.checkoutDate.toISOString().split("T")[0],
    "Due Date": borrowing.dueDate.toISOString().split("T")[0],
    "Returned Date": borrowing.returnedDate
      ? borrowing.returnedDate.toISOString().split("T")[0]
      : "Not Returned",
  }))

  // generate CSV
  const csv = json2csv(csvData, {
    delimiter: { field: "," },
  })

  const filePath = path.join(__dirname, "borrowings-report.csv")
  fs.writeFileSync(filePath, csv)

  // Send file for download
  res.download(filePath, "borrowings-report.csv", (err) => {
    if (err) {
      console.error("Error sending file:", err)
      return res.status(500).json({
        error: "Internal server error",
        message: `Error sending the CSV file: ${err.message}`,
      })
    }
    // Delete the file after sending it
    fs.unlinkSync(filePath)
  })
}
