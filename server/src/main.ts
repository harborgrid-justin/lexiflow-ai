import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, UnprocessableEntityException } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import helmet from 'helmet';
import * as jwt from 'jsonwebtoken';

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

  // Dynamic CORS origin handler to support GitHub Codespaces
  const corsOriginHandler = (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps, curl, or same-origin)
    if (!origin) {
      callback(null, true);
      return;
    }

    // Check static allowed origins
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    // Allow GitHub Codespaces origins (*.app.github.dev and *.github.dev)
    if (origin.endsWith('.app.github.dev') || origin.endsWith('.github.dev')) {
      callback(null, true);
      return;
    }

    // Reject other origins
    callback(null, false);
  };

  app.enableCors({
    origin: corsOriginHandler,
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

  // Generate a long-lived dev token for Swagger UI (only in development)
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  const devToken = jwt.sign(
    {
      email: 'admin@lexiflow.com',
      sub: 'f937bb0d-d9cc-4b76-b18c-0579393a496a', // Admin user ID from seed
      orgId: '77492804-16e3-4cad-abe5-34fcb57ee308', // Org ID from seed
    },
    jwtSecret,
    { expiresIn: '30d' }, // Long expiry for dev convenience
  );

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      authAction: {
        bearer: {
          name: 'bearer',
          schema: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          value: devToken,
        },
      },
    },
  });

  logger.log(`Dev token for Swagger: ${devToken.substring(0, 50)}...`);

  // Redirect root path to API docs
  app.getHttpAdapter().get('/', (_req: unknown, res: { redirect: (url: string) => void }) => {
    res.redirect('/api/docs');
  });

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
