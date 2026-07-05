import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js'
import cookieParser from 'cookie-parser'
import cors from "cors"

import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 6000

app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: ["http://localhost:5174", "http://localhost:5175"],
  credentials: true
}))

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/product", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/order", orderRoutes)

// start server AFTER DB connects
const startServer = async () => {
  try {
    await connectDb()
    app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  } catch (err) {
    console.log("DB connection failed", err)
  }
}

startServer()