import amqp from 'amqplib'
import { MoistureMessage } from './MoistureMessage'

export class MoisturePublisher {
    _connection: amqp.Connection|null
    _channel: amqp.Channel|null
    _queue: string
    async connect(queueName: string): Promise<void> {
        this._queue = queueName
        this._connection = await amqp.connect(process.env.RABBITMQ_BROKER)
        this._channel = await this._connection.createChannel()
        await this._channel.assertQueue(queueName, {durable: true})
    }
    publish(message: MoistureMessage): void {
        this._channel.sendToQueue(this._queue, Buffer.from(JSON.stringify(message)));
    }
    async disconnect(): Promise<void> {
        await this._connection.close()
    }
}