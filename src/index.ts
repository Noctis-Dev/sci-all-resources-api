import mongoose from 'npm:mongoose';
import { startRabbitMQConsumer } from './infrastructure/messaging/RabbitMQConsumer.ts';
import { handleResourceEvent } from './adapters/events/EventController.ts';
import process from 'node:process';

const startApp = async () => {
  const mongoUri = process.env.MONGODB_URI || '';
  await mongoose.connect(mongoUri, {
    authSource: 'admin',
  });
  await startRabbitMQConsumer(handleResourceEvent);

  console.log('API de recursos escuchando eventos de RabbitMQ');
};

startApp().catch((err) => console.error(err));
