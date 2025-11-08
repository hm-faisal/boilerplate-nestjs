import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, NestInterceptor, VersioningType } from '@nestjs/common';
import { GlobalExceptionFilter } from './filter/http-exception.filter';
import {
  GlobalInterceptor,
  LoggingInterceptor,
  SanitizeResponseInterceptor,
  TimeoutInterceptor,
} from './interceptors/response.interceptor';
import { SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { corsConfig } from './config/cors';
import { swaggerConfig } from './config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  if (process.env.NODE_ENV !== 'production') {
    const document = () =>
      SwaggerModule.createDocument(
        app,
        swaggerConfig(configService.get('PORT') ?? 3000),
        {
          ignoreGlobalPrefix: true,
        },
      );

    SwaggerModule.setup('api-docs', app, document, {
      explorer: true,
    });
    Logger.log('Swagger documentation available at /api-docs');
  }

  // Set a global prefix for all routes, e.g., /api/v1/users
  app.setGlobalPrefix('api', {
    exclude: ['/health'], // Exclude the health check endpoint
  });

  // Enable URI-based versioning for the API
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v', // e.g., /api/v1, /api/v2
    defaultVersion: '1',
  });

  // Apply a global filter to catch and format HTTP exceptions
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Define a list of global interceptors.
  const interceptors: NestInterceptor[] = [
    new GlobalInterceptor(), // Transforms response to a standard format
    new TimeoutInterceptor(), // Sets a request timeout
    new SanitizeResponseInterceptor(), // Removes sensitive data from the response
  ];

  // Add the logging interceptor only in non-production environments
  if (configService.get('NODE_ENV') !== 'production') {
    interceptors.unshift(new LoggingInterceptor()); // Logs request and response details
  }

  app.useGlobalInterceptors(...interceptors);

  app.use(helmet());
  app.enableCors(corsConfig);

  await app.listen(configService.get('PORT') ?? 3000);
}
void bootstrap();
