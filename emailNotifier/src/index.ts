import { configDotenv } from "dotenv";
import { consumeMessages } from "./services/amqpConsumer";
import { processMoistureMessage } from "./services/processEvent";
import mongoose from "mongoose";
configDotenv()

mongoose.connect(process.env.MONGODB_URL)
    .then(async () => {
        await consumeMessages('moisture_level', async (message) => {
            await processMoistureMessage(message)
        })
        console.log('server started')
    })
