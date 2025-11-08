import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { ThrottlerModule } from '@nestjs/throttler';
import { ResultsModule } from './results/results.module';

@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),

    // Rate limiting
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 15 * 60 * 1000,
          limit: 10000,
        },
      ],
    }),

    // api modules
    HealthModule,
    AuthModule,
    ResultsModule,
  ],
})
export class AppModule {}
