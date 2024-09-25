import { Request, Response } from "express"
import getBorrowersQuery from "../../queries/borrower/get-borrowers"
import * as db from '../../database/index'

const getBorrowers = async (req: Request, res: Response) => {
  try {
    const result = await db.query(getBorrowersQuery)

    res.status(200).json(result.rows)

  } catch (error: any) {

    console.log(`Error fetching borrowers: ${error.message}`)

    res.status(500).json({
      error: "Internal server error",
      message: error.message
    })
    
  }
}
export default getBorrowers
