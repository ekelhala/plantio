import Express from 'express'
import { configDotenv } from 'dotenv'
configDotenv()
import mongoose from 'mongoose'

import api from './routes/api'

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

app.use('/api', api)

init()
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})