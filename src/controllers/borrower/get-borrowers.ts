import { Request, Response } from "express"

const getBorrowers = async (req: Request, res: Response) => {
  try {
    const { prisma } = req.context
    const borrowers = await prisma.borrower.findMany()

    res.status(200).json(borrowers)

  } catch (error: any) {

    console.log(`Error fetching borrowers: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message
    })
    
  }
}
export default getBorrowers
