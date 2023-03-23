import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://localhost:3000',
      'http://localhost',
    ],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const options: SwaggerDocumentOptions = {
    deepScanRoutes: true,
  };
  const config = new DocumentBuilder().setTitle('Calendar API').build();
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
