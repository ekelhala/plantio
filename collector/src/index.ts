import mqtt, { MqttClient } from "mqtt"
import { configDotenv } from "dotenv"
configDotenv()
import mongoose from "mongoose"

let mqttClient : MqttClient
const mqttOptions = {
    port: Number(process.env.MQTT_PORT),
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD}

const topics = ['/moisture_level']

const onMQTTMessage = async (topic: string, message: Buffer) => {
        try {
            const messageParsed = JSON.parse(message.toString())
            console.log(messageParsed)
        }
        catch(error) {
            console.log('Invalid message received:', message.toString())
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
        mongoose.connect(process.env.MONGODB_URL)
    }
    catch(err) {
        console.log('Unable to connect to MongoDB, got error:', err)
    }
}

console.log('Server is starting')
init()
