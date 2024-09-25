import { Request, Response } from "express"
import * as path from "path"
import * as fs from "fs"
import { Parser } from "json2csv"

/**
 * @function exportOverdueLastMonth
 * @description Generates a CSV report of all overdue borrowings from the previous month and sends it to the client for download.
 *    The report includes details such as book title, borrower name, email, checkout date, and due date.
 * 
 * @param {Request} req - The Express request object. It includes:
 *   - `req.context.prisma`: The Prisma client instance for database operations.
 * @param {Response} res - The Express response object. Used to:
 *   - Return a JSON response if there is an error or if no overdue borrowings are found.
 *   - Send a CSV file for download if the report is successfully generated.
 * 
 * @returns {void} Returns:
 *   - A JSON response with an error message if an internal error occurs or no overdue borrowings are found.
 *   - A CSV file for download with the overdue borrowing report if successful.
 */

const exportOverdueLastMonth = async (req: Request, res: Response) => {
  try {
    const { prisma } = req.context

    // Calculate the last month's date range
    const today = new Date()
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
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
      return res.status(404).json({
        error: "Not Found",
        message: "No overdue borrowings found for the last month.",
      })
    }

    const csvData = overdueBorrowings.map((borrowing) => ({
      "Book Title": borrowing.book.title,
      "Borrower Name": borrowing.borrower.name,
      "Borrower Email": borrowing.borrower.email,
      "Checkout Date": borrowing.checkoutDate.toISOString().split("T")[0],
      "Due Date": borrowing.dueDate.toISOString().split("T")[0],
    }))

    // Generate CSV
    const json2csvParser = new Parser()
    const csv = json2csvParser.parse(csvData)

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
  } catch (error: any) {
    console.log(`Error exporting overdue borrowings of last month: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    })
  }
}

export default exportOverdueLastMonth