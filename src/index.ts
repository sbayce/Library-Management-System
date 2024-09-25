import express from 'express'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import bookRouter from './routes/book'
import borrowerRouter from './routes/borrower'
import borrowingRouter from './routes/borrowing'

declare global {
    namespace Express {
      interface Request {
        context: {
          prisma: PrismaClient;
        };
      }
    }
  }

const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json())
app.use((req, res, next) => {
    req.context = {
      prisma: new PrismaClient(),
    };
    next();
  });
app.use('/book', bookRouter)
app.use('/borrower', borrowerRouter)
app.use('/borrowing', borrowingRouter)
app.get('/', (req, res) => {
    res.send("testt.")
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})