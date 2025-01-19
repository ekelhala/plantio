import mqtt, { MqttClient } from "mqtt"
import { configDotenv } from "dotenv"
configDotenv()
import mongoose from "mongoose"
import { IMoistureLevel, MoistureLevel } from "./models/MoistureLevel"
import schedule from 'node-schedule'
import { MoisturePublisher } from "./types/MoisturePublisher"
import { SensorValue } from "./types/SensorValue"

let mqttClient : MqttClient
const mqttOptions = {
    port: Number(process.env.MQTT_PORT),
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD}

const topics = ['/moisture_level']
const buffer = new Map<string, SensorValue[]>()
const BUFFER_LIMIT = 5

const saveBuffer = async () => {
    console.log('running job...')
    try {
        let moistureLevels: IMoistureLevel[] = []
        const publisher = new MoisturePublisher()
        await publisher.connect('moisture_level')
        for(let sensorValues of buffer.values()) {
            for(let sensorValue of sensorValues) {
                const moistureLevel = new MoistureLevel(sensorValue)
                moistureLevels.push(moistureLevel)
                publisher.publish({nodeId: sensorValue.nodeId, value: sensorValue.value})
            }
        }
        await MoistureLevel.insertMany(moistureLevels)
        await publisher.disconnect()
        buffer.clear()
    }
    catch(error) {
        console.log('Error in saveBuffer:', error)
    }
}

const onMQTTMessage = async (_, message: Buffer) => {
        try {
            const messageParsed: SensorValue = JSON.parse(message.toString())
            const bufferedValues = buffer.get(messageParsed.nodeId)
            if(bufferedValues) {
                if(bufferedValues.length >= BUFFER_LIMIT) bufferedValues.shift()
                bufferedValues.push(messageParsed)
            }
            else {
                buffer.set(messageParsed.nodeId, [messageParsed])
            }
            console.log(buffer)
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
    schedule.scheduleJob('*/2 * * * *', async () => {
        try {
            await saveBuffer()
        }
        catch(error) {
            console.log(error)
        }
    })
    //done!
    console.log('Server started in', (Date.now()-startTime), 'ms')
}

const startTime = Date.now()
console.log('Server is starting')
init()
