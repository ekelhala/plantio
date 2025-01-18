import amqp from 'amqplib';
import { MoistureMessage } from '../types/MoistureMessage';

export const consumeMessages = async (queue: string, onMessage: (msg: MoistureMessage) => void) => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_BROKER || 'amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, (message) => {
      if (message) {
        const content = JSON.parse(message.content.toString());

        onMessage(content);

        channel.ack(message);
      }
    });

    console.log(`Listening for messages on queue: ${queue}`);
  } catch (error) {
    console.error('Error consuming messages:', error);
  }
};