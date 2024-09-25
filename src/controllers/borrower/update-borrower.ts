import { Request, Response } from "express"
import { isValidEmail } from "../../services/validate-email"

const updateBorrower = async (req: Request, res: Response) => {
  try {
    const { prisma } = req.context
    const { borrowerId } = req.params
    const {name, email, createdAt} = req.body

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

    if(!name && !email && !createdAt ){
        return res.status(400).json({
            error: "Bad Request",
            message: "No fields where provided to update."
        })
    }

    if(email && !isValidEmail(email)) {
        return res.status(400).json({
            error: "Bad Request",
            message: "Email format is invalid."
        })
    }
    
    // Check if the borrower exists
    const existingBorrower = await prisma.borrower.findUnique({
        where: { id },
      })
  
      if (!existingBorrower) {
        return res.status(404).json({
          error: "Not Found",
          message: "Borrower not found.",
        })
      }
  
      // Update borrower
      const updatedBorrower = await prisma.borrower.update({
        where: { id },
        data: {
          name: name ?? existingBorrower.name, // Use existing value if not provided
          email: email ?? existingBorrower.email, // Use existing value if not provided
          createdAt: createdAt ? new Date(createdAt) : existingBorrower.createdAt, // Parse date if provided
        },
      })

    res.status(200).json({
        message: "Borrower updated successfully.",
        updatedBorrower
    })

  } catch (error: any) {

    console.log(`Error updating borrower: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message
    })
    
  }
}
export default updateBorrower
