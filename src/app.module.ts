import { Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './Modules/users/users.module';
import { ConfigsModule } from './config/configuration/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db/database.providers';
import { HealthController } from './health.controller';
import { SuccessResponseInterceptor } from './interceptors/success-response.interceptor';
import { ErrorsFilter } from './filters/errors.filter';

@Module({
  imports: [LoggerModule, ConfigsModule, AuthModule, UsersModule,
    TypeOrmModule.forRoot(dataSourceOptions)
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorsFilter,
    },
  ],

})
export class AppModule {}
