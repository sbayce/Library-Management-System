import { Request, Response } from "express"
import prisma from "../../db"
import { NotFoundError } from "../../errors"
import { json2csv } from "json-2-csv"
import path from "path"
import fs from "fs"

/**
 * @param {Request} _req
 * @param {Response} res
 * @returns
 * 200 OK - CSV file download containing overdue borrowings from the last month
 * 404 Not Found - If no overdue borrowings are found for the last month
 */

export const exportOverdueLastMonth = async (_req: Request, res: Response) => {
  // Calculate the last month's date range
  const today = new Date()
  const startOfLastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  )
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)

  // Query for overdue borrowings (due date is before today and not returned)
  const overdueBorrowings = await prisma.borrowing.findMany({
    where: {
      checkoutDate: {
        gte: startOfLastMonth, // Only include borrowings of last month
        lte: endOfLastMonth,
      },
      dueDate: {
        lte: endOfLastMonth,
      },
      returnedDate: null, // Book has not been returned
    },
    include: {
      book: true,
      borrower: true,
    },
  })

  if (overdueBorrowings.length === 0) {
    throw new NotFoundError("No overdue borrowings found for the last month")
  }

  const csvData = overdueBorrowings.map((borrowing) => ({
    "Book Title": borrowing.book.title,
    "Borrower Name": borrowing.borrower.name,
    "Borrower Email": borrowing.borrower.email,
    "Checkout Date": borrowing.checkoutDate.toISOString().split("T")[0],
    "Due Date": borrowing.dueDate.toISOString().split("T")[0],
  }))

  // generate CSV
  const csv = json2csv(csvData, {
    delimiter: { field: "," },
  })

  const filePath = path.join(__dirname, "overdue-borrowings-report.csv")
  fs.writeFileSync(filePath, csv)

  // Send file for download
  res.download(filePath, "overdue-borrowings-report.csv", (err) => {
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
