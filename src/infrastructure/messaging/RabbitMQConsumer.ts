import amqplib from 'npm:amqplib';

const rabbitSettings = {
  protocol: 'amqp',
  hostname: '50.19.40.173',
  port: 5672,
  username: 'guest',
  password: 'guest'
}

export const startRabbitMQConsumer = async (processMessage: (msg: any) => Promise<void>) => {
  const connection = await amqplib.connect(rabbitSettings);
  const channel = await connection.createChannel();

  const queue = 'recursos';
  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (msg: amqplib.ConsumeMessage | null) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      await processMessage(content);
      channel.ack(msg);
    }
  });
};
