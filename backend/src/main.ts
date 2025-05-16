import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors'; // Substituindo require por import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cors({ origin: 'http://localhost:3000' })); // Substitua pela URL do frontend
  await app.listen(process.env.PORT ?? 8001);
}
bootstrap();
