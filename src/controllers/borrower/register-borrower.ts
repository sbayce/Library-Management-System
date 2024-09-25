import { Request, Response } from "express"
import registerBorrowerQuery from "../../queries/borrower/register-borrower"
import * as db from '../../database/index'
import { isValidEmail } from "../../services/validate-email"

const registerBorrower = async (req: Request, res: Response) => {
  try {
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
    
    const result = await db.query(registerBorrowerQuery, [name, email, new Date()])

    res.status(201).json({
        message: "Borrower registered successfully.",
        borrower: result.rows[0]
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
