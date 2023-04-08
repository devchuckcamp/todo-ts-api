import express, { Express, Request, Response, Errback } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connect } from 'mongoose'
import todoRoutes from './routes/todoRoutes'

const allowedOrigins = '*'

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

dotenv.config()

const app = express()
const port = process.env.port || 3001
const mongoConnectionString = process.env.mongodburi?.toString()||'mongodb+srv://santiago:password123!@cluster0.4jwmh9o.mongodb.net/?retryWrites=true&w=majority'
const apiVersion = process.env.api_version || "V1"

// Middleware
app.use(cors(options))

// Connect to MongoDB Atlas
connect(`${mongoConnectionString}`, {} )
  .then(() => console.log('Connected to MongoDB Database'))
  .catch((err) => console.error('Error connecting to MongoDB Atlas:', err.message))


app.use(express.json())
// Routes
app.use(`/api/${apiVersion}/todo`, todoRoutes)

app.listen(port, () => {

  console.log(`Server is running API ${apiVersion} on port ${port}`)
});