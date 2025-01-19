import amqp from 'amqplib';
import { MoistureMessage } from '../types/MoistureMessage';

export const consumeMessages = async (queue: string, onMessage: (msg: MoistureMessage) => Promise<void>) => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_BROKER)
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true })
    await channel.prefetch(1)

    await channel.consume(queue, async (message) => {
      if (message) {
        const content = JSON.parse(message.content.toString());

        await onMessage(content);

        channel.ack(message);
      }
    })

  } catch (error) {
    console.error('Error consuming messages:', error);
  }
};