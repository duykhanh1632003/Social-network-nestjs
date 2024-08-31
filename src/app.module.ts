import { Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './Modules/users/users.module';
import { ConfigsModule } from './config/configuration/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db/database.providers';

@Module({
  imports: [LoggerModule, ConfigsModule, AuthModule, UsersModule,
    TypeOrmModule.forRoot(dataSourceOptions)
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ],
})
export class AppModule {}
