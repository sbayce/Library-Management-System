import { Request, Response } from "express"

const getActiveBorrowings = async (req: Request, res: Response) => {
  try {
    const { prisma } = req.context

    // Fetch active borrowings where returnedDate is null
    const activeBorrowings = await prisma.borrowing.findMany({
      where: { returnedDate: null },
      include: {
        book: true,        // Include book details
        borrower: true,    // Include borrower details
      },
    });

    res.status(200).json({
      message: "Current active borrowings",
      activeBorrowings
    })

  } catch (error: any) {
    console.log(`Error fetching active borrowings: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message
    })
    
  }
}
export default getActiveBorrowings
