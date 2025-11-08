import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { healthResponse } from './entities/health.entity';

@Controller({
  path: 'health',
  version: VERSION_NEUTRAL,
})
export class HealthController {
  @Get()
  @ApiOkResponse({
    type: healthResponse,
  })
  getHealth() {
    return 'server is running';
  }
}
