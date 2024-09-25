import { Request, Response } from "express"
import deleteBorrowerQuery from "../../queries/borrower/delete-borrower"
import * as db from '../../database/index'

const deleteBorrower = async (req: Request, res: Response) => {
  try {
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

    const result = await db.query(deleteBorrowerQuery, [borrowerId])

    if(result.rowCount === 0){
        return res.status(404).json({
            error: "Not Found",
            message: "Borrower not found."
        })
    }
    res.status(200).json({
        message: "Borrower deleted successfully.",
        deletedBorrower: result.rows[0]
    })

  } catch (error: any) {

    console.log(`Error deleting borrower: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message
    })
    
  }
}
export default deleteBorrower
