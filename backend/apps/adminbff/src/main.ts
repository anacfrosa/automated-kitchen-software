import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AdminbffModule } from './adminbff.module';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AdminbffModule);

  // enable cors and global prefix for apis
  app.enableCors();
  app.setGlobalPrefix('admin/api/v1');
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Admin APIs')
    .setDescription('The admin APIs description')
    .setVersion('1.0')
    .build();

  const options: SwaggerDocumentOptions = { ignoreGlobalPrefix: false };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('admin/api/v1/swagger', app, document);

  await app.listen(8080);
}

bootstrap();
