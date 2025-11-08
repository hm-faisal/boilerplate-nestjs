import { DocumentBuilder } from '@nestjs/swagger';
import { InternalServerErrorResponse } from 'src/common/dto/responses/500';

export const swaggerConfig = (port: number | string) =>
  new DocumentBuilder()
    .setTitle('Inventory System API')
    .setDescription('API for managing the inventory system.')
    .setVersion('1.0')
    .addServer(`http://localhost:${port}/api`, 'Development server')
    .addServer(`http://localhost:${port}`, 'Base server')
    .addGlobalResponse({
      status: 500,
      description: 'INTERNAL SERVER ERROR',
      type: InternalServerErrorResponse,
    })
    .build();
