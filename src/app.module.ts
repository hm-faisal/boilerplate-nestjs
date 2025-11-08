import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';

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
    PrismaModule,
  ],
})
export class AppModule {}
