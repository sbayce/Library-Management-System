import { Request, Response } from "express"
import { isValidEmail } from "../../services/validate-email"

const registerBorrower = async (req: Request, res: Response) => {
  try {
    const { prisma } = req.context
    const { name, email } = req.body
    if(!name || !email ){
        return res.status(400).json({
            error: "Bad Request",
            message: "name and email are required."
        })
    }

    if(!isValidEmail(email)) {
        return res.status(400).json({
            error: "Bad Request",
            message: "Email format is invalid."
        })
    }
    
    // Check if email already exists
    const existingBorrower = await prisma.borrower.findUnique({
      where: { email },
    })

    if (existingBorrower) {
      return res.status(409).json({
        error: "Conflict",
        message: "A borrower with this email already exists.",
      })
    }

    // Register new borrower
    const newBorrower = await prisma.borrower.create({
      data: {
        name,
        email
      },
    })

    res.status(201).json({
        message: "Borrower registered successfully.",
        borrower: newBorrower
    })

  } catch (error: any) {

    console.log(`Error registering borrower: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message
    })
    
  }
}
export default registerBorrower
