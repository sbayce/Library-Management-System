import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT)
})

export const query = async (text: string, params?: any[]) => {
    try{
        return await pool.query(text, params)
    }catch (error: any){
        throw new Error(`Database query failed: ${error.message}`)
    }
}