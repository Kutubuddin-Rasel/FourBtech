// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const origin =
    process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL!       
      : 'http://localhost:3000';

  app.enableCors({
    origin,
    credentials: true,
  });
  const port = process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : 3001;

  await app.listen(port);
  console.log(`🚀 Listening on port ${port}`);
}
bootstrap();
