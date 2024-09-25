import { Request, Response } from "express"
import * as path from 'path'
import * as fs from 'fs'
import { Parser } from 'json2csv'

const exportBorrowingReport = async (req: Request, res: Response) => {
  try {
    const { prisma } = req.context
    const { startDate, endDate } = req.query

    if (!startDate || !endDate) {
        return res.status(400).json({
          error: "Bad Request",
          message: "startDate and endDate are required.",
        })
    }

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
        return res.status(404).json({
          error: "Not Found",
          message: "No borrowings found for the specified date range.",
        })
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
      const json2csvParser = new Parser()
      const csv = json2csvParser.parse(csvData)

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

  } catch (error: any) {

    console.log(`Error exporting borrowing report of specified period: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message
    })
  }
}
export default exportBorrowingReport
