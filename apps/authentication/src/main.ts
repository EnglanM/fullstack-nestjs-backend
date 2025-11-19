import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AuthenticationModule } from './authentication.module';
import { microservicesConfig } from 'config/microservices.config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthenticationModule,
    microservicesConfig.authentication as MicroserviceOptions,
  );

  await app.listen();
  console.log(
    `Authentication microservice is listening on TCP port ${process.env.AUTH_TCP_PORT}`,
  );
}
bootstrap();
