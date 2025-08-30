import { Request, Response } from "express"
import prisma from "../../db"
import { NotFoundError } from "../../errors"
import { json2csv } from "json-2-csv"
import path from "path"
import fs from "fs"

/**
 * @param {Request} req
 * @param {Response} res
 * @returns
 * 200 OK - Sends a downloadable CSV file containing last month's borrowings
 * 404 Not Found - If no borrowings are found for the last month
 */

export const exportBorrowingLastMonth = async (
  _req: Request,
  res: Response
) => {
  // Calculate the last month's date range
  const today = new Date()
  const startOfLastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  )
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)

  const borrowings = await prisma.borrowing.findMany({
    where: {
      checkoutDate: {
        gte: startOfLastMonth, // Only include borrowings checked out last month
        lte: endOfLastMonth,
      },
    },
    include: {
      book: true,
      borrower: true,
    },
  })

  if (borrowings.length === 0) {
    throw new NotFoundError("No borrowings found for the last month")
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

  // generate CSV using json-2-csv
  const csv = json2csv(csvData, {
    delimiter: { field: "," },
  })

  const filePath = path.join(__dirname, "borrowings-last-month.csv")
  fs.writeFileSync(filePath, csv)

  // Send file for download
  res.download(filePath, "borrowings-last-month.csv", (err) => {
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
