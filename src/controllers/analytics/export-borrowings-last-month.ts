import { Request, Response } from "express";
import * as path from "path";
import * as fs from "fs";
import { Parser } from "json2csv";

const exportBorrowingsLastMonth = async (req: Request, res: Response) => {
  try {
    const { prisma } = req.context;

    // Calculate the last month's date range
    const today = new Date();
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

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
    });

    if (borrowings.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: "No borrowings found for the last month.",
      });
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
    }));

    // Generate CSV
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(csvData);

    const filePath = path.join(__dirname, "all-borrowings-last-month.csv");
    fs.writeFileSync(filePath, csv);

    // Send file for download
    res.download(filePath, "all-borrowings-last-month.csv", (err) => {
      if (err) {
        console.error("Error sending file:", err);
        return res.status(500).json({
          error: "Internal server error",
          message: `Error sending the CSV file: ${err.message}`,
        });
      }
      // Delete the file after sending it
      fs.unlinkSync(filePath);
    });
  } catch (error: any) {
    console.log(`Error exporting all borrowings of the last month: ${error.message}`);

    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

export default exportBorrowingsLastMonth;
