import { Request, Response } from "express"
import updateBorrowerQuery from "../../queries/borrower/update-borrower"
import * as db from '../../database/index'
import { isValidEmail } from "../../services/validate-email"

const updateBorrower = async (req: Request, res: Response) => {
  try {
    const { borrowerId } = req.params
    const {name, email, registered_date} = req.body

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

    if(!name && !email && !registered_date ){
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
    
    const result = await db.query(updateBorrowerQuery, [name, email, registered_date, borrowerId])

    if(result.rowCount === 0) {
        return res.status(404).json({
            error: "Not Found",
            message: "Borrower not found."
        })
    }

    res.status(200).json({
        message: "Borrower updated successfully.",
        updatedBorrower: result.rows[0]
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
