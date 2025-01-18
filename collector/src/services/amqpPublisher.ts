import amqp from 'amqplib';
import { MoistureMessage } from '../types/MoistureMessage';

export const publishMessage = async (queue: string, message: MoistureMessage) => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_BROKER);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error('Error publishing message:', error);
  }
};