import mongoose from 'npm:mongoose';
import express from 'npm:express';
import { startRabbitMQConsumer } from './infrastructure/messaging/RabbitMQConsumer.ts';
import { handleResourceEvent } from './adapters/events/EventController.ts';
import resourceRouter from './adapters/http/ResourceController.ts';

const startApp = async () => {
  const mongouri = Deno.env.get('MONGODB_URI');
  await mongoose.connect(mongouri!, {
    authSource: 'admin',
  });
  console.log('Conectado a MongoDB');

  await startRabbitMQConsumer(handleResourceEvent);
  console.log('API de recursos escuchando eventos de RabbitMQ');

  const app = express();
  app.use(express.json());
  app.use('/api/v1', resourceRouter);

  const port = 3000;
  app.listen(port, () => {
    console.log(`API REST de recursos corriendo en http://localhost:${port}`);
  });
};

startApp().catch((err) => console.error(err));