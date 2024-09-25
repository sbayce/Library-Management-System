import { Request, Response } from "express"

const getOverdueBooks = async (req: Request, res: Response) => {
  try {
    const { prisma } = req.context

    const currentDate = new Date()

    // Query for overdue books
    const overdueBorrowings = await prisma.borrowing.findMany({
        where: {
          dueDate: {
            lt: currentDate, // Due date is before the current date
          },
          returnedDate: null, // Book has not been returned
        },
        include: {
          book: true, // Include book details
          borrower: true, // Include borrower details
        },
    })
  
    if (overdueBorrowings.length === 0) {
        return res.status(404).json({
          message: "No overdue books found.",
        })
    }

    res.status(200).json({
        message: "Overdue books",
        overdueBooks: overdueBorrowings,
    })


  } catch (error: any) {
    console.log(`Error fetching overdue books: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message
    })
    
  }
}
export default getOverdueBooks
