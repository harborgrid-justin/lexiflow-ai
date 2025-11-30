import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, UnprocessableEntityException } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  }));

  // Enable CORS for frontend integration
  // Parse CORS_ORIGINS from environment variable if provided
  const corsOriginsEnv = process.env.CORS_ORIGINS?.split(',').map(s => s.trim()).filter(Boolean) || [];

  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL,
    ...corsOriginsEnv,
  ].filter((origin, index, self) => Boolean(origin) && self.indexOf(origin) === index);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
  });

  // Global exception filter for consistent error handling
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global validation pipe with detailed error messages
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      errorHttpStatusCode: 422,
      exceptionFactory: (errors) => {
        // Transform validation errors into structured format
        const fieldErrors = errors.map((error) => ({
          field: error.property,
          errors: Object.values(error.constraints || {}),
        }));
        // Return proper HttpException so HttpExceptionFilter can process it
        return new UnprocessableEntityException({
          statusCode: 422,
          message: 'Validation failed',
          error: 'Unprocessable Entity',
          errors: fieldErrors,
        });
      },
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
    .addTag('search')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  logger.log(`LexiFlow API is running on: http://localhost:${port}`);
  logger.log(`API Documentation: http://localhost:${port}/api/docs`);
  logger.log(`CORS enabled for: ${allowedOrigins.join(', ')}`);
  logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
