import { Request, Response } from "express"
import { isValidEmail } from "../../services/validate-email"

/**
 * @function registerBorrower
 * @description Handles the registration of a new borrower. This includes validating the input data,
 *    checking if the email already exists in the database, and creating a new borrower record if the email is unique.
 * 
 * @param {Request} req - The Express request object. Contains:
 *   - `req.body.name`: The name of the borrower to register.
 *   - `req.body.email`: The email address of the borrower to register.
 * @param {Response} res - The Express response object. Used to return:
 *   - A JSON response with a success message and the newly created borrower record, or
 *   - An error message if validation fails or if the email is already in use.
 * 
 * @returns {void} Returns a JSON response with the result of the registration operation and any relevant data.
 */

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
    // validate email
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
