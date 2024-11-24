import amqplib from 'npm:amqplib';

const rabbitSettings = {
  protocol: 'amqp',
  hostname: Deno.env.get('R_HOSTNAME'),
  port: 5672,
  username: Deno.env.get('R_USER'),
  password: Deno.env.get('R_PASSWORD'),
}

export const startRabbitMQConsumer = async (processMessage: (msg: any) => Promise<void>) => {
  const connection = await amqplib.connect(rabbitSettings);
  const channel = await connection.createChannel();

  const queue = 'recursos';
  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (msg: amqplib.ConsumeMessage | null) => {
    if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        console.log("Mensaje recibido: ", content);

        console.log("Tamaño del recurso:", content.resource?.length);
        console.log("Inicio del recurso:", content.resource?.substring(0, 100)); // Muestra los primeros 100 caracteres
        console.log("Fin del recurso:", content.resource?.substring(content.resource.length - 100)); // Muestra los últimos 100 caracteres

        await processMessage(content);
        channel.ack(msg);
    }
});
};
