import express from "express"
import cors from "cors"
import bookRouter from "./routes/book"
import borrowerRouter from "./routes/borrower"
import borrowingRouter from "./routes/borrowing"
import { errorHandlerMiddleware } from "./middleware/error-handler"
import analyticsRouter from "./routes/analytics"
import dotenv from "dotenv"
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (_req, res) => {
  res.send("Hello")
})

app.use("/books", bookRouter)
app.use("/borrowers", borrowerRouter)
app.use("/borrowings", borrowingRouter)
app.use("/analytics", analyticsRouter)

app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
