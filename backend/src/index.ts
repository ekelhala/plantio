import Express from 'express'
import { configDotenv } from 'dotenv'
configDotenv()
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import moistureLevel from './routes/moistureLevel'
import auth from './routes/auth'
import nodes from './routes/nodes'
import verifyEmail from './routes/verifyEmail'

const PORT = Number(process.env.PORT) || 8000

const init = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('Connected to MongoDB')
    }
    catch(err) {
        console.log('Failed to connect to MongoDB, got error:', err)
    }
}

const app = Express()

app.use(cors({credentials: true, origin: true}))
app.use(Express.json())
app.use(cookieParser())
app.use('/moisture_level', moistureLevel)
app.use('/auth', auth)
app.use('/nodes', nodes)
app.use('/verify-email', verifyEmail)

init()
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})