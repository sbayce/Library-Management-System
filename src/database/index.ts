import { Pool } from 'pg'

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "Library-MS",
    password: "Youssef$777",
    port: 5432
})

export const query = async (text: string, params?: any[]) => {
    try{
        return await pool.query(text, params)
    }catch (error: any){
        throw new Error(`Database query failed: ${error.message}`)
    }
}