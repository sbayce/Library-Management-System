import { Request, Response } from "express"

const deleteBorrower = async (req: Request, res: Response) => {
  try {
    const { prisma } = req.context
    const { borrowerId } = req.params

    if(!borrowerId){
        return res.status(400).json({
            error: "Bad Request",
            message: "Borrower ID is required."
        })
    }

    const id = parseInt(borrowerId, 10)
    if(isNaN(id)) {
        return res.status(400).json({
            error: "Bad Request",
            message: "Invalid borrower ID."
        })
    }

    // delete borrower
    const deletedBorrower = await prisma.borrower.delete({
      where: { id },
    })

    res.status(200).json({
        message: "Borrower deleted successfully.",
        deletedBorrower
    })

  } catch (error: any) {
    if (error.code === "P2025") {
      // Error code for "Record to delete does not exist"
      return res.status(404).json({
        error: "Not Found",
        message: "Borrower not found.",
      })
    }
    console.log(`Error deleting borrower: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message
    })
    
  }
}
export default deleteBorrower
