import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend integration
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle('LexiFlow AI Legal Management API')
    .setDescription('Comprehensive API for legal case management, document handling, and workflow automation')
    .setVersion('1.0')
    .addTag('authentication')
    .addTag('organizations')
    .addTag('users')
    .addTag('cases')
    .addTag('documents')
    .addTag('evidence')
    .addTag('messages')
    .addTag('workflow')
    .addTag('motions')
    .addTag('billing')
    .addTag('discovery')
    .addTag('clients')
    .addTag('analytics')
    .addTag('compliance')
    .addTag('knowledge')
    .addTag('jurisdictions')
    .addTag('calendar')
    .addTag('tasks')
    .addTag('clauses')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 LexiFlow API is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();