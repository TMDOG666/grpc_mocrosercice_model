import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'community',
      protoPath: join(__dirname, 'proto/community.proto'),
      url: process.env.SERVICE_GRPC_HOST,
    },
  });
  app.listen();

  const app1 = await NestFactory.create(AppModule);

  app1.listen(process.env.SERVICE_HTTP_PORT);
}
bootstrap();