import mqtt, { MqttClient } from "mqtt"
import { configDotenv } from "dotenv"
configDotenv()
import mongoose from "mongoose"
import { MoistureLevel } from "./models/MoistureLevel"

let mqttClient : MqttClient
const mqttOptions = {
    port: Number(process.env.MQTT_PORT),
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD}

const topics = ['/moisture_level']

const onMQTTMessage = async (_, message: Buffer) => {
        try {
            const messageParsed = JSON.parse(message.toString())
            console.log(messageParsed)
            const moistureLevel = new MoistureLevel(messageParsed)
            await moistureLevel.save()
        }
        catch(error) {
            console.log('Invalid message received:', message.toString(), 'got error:', error)
        }
}

const init = async () => {
    // initialize MQTT
    try {
        mqttClient = await mqtt.connectAsync(process.env.MQTT_URL, mqttOptions)
        console.log('Connected to MQTT broker')
        mqttClient.subscribe(topics)
        mqttClient.on('message', onMQTTMessage)
        console.log('MQTT successfully initialized')
    }
    catch(err) {
        console.log('Unable to connect to MQTT broker, got error: ', err)
    }
    // initialize MongoDB
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('MongoDB successfully initialized')
    }
    catch(err) {
        console.log('Unable to connect to MongoDB, got error:', err)
    }
    //done!
    console.log('Server started in', (Date.now()-startTime), 'ms')
}

const startTime = Date.now()
console.log('Server is starting')
init()
