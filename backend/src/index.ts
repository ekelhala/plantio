import Express from 'express'
import { configDotenv } from 'dotenv'
configDotenv()

import api from './routes/api'

const PORT = Number(process.env.PORT) || 8000

const app = Express()

app.use('/api', api)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})