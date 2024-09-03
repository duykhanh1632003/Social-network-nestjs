import { Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './Modules/users/users.module';
import { ConfigsModule } from './config/configuration/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db/data-source';
import { HealthController } from './health.controller';
import { SuccessResponseInterceptor } from './interceptors/success-response.interceptor';
import { ErrorsFilter } from './filters/errors.filter';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { FollowModule } from './Modules/follow/follow.module';
import { PostModule } from './Modules/post/post.module';
import { ChatroomModule } from './Modules/chatroom/chatroom.module';
import { CommentModule } from './Modules/comment/comment.module';
import { MessageModule } from './Modules/message/message.module';

@Module({
  imports: [LoggerModule, ConfigsModule, AuthModule, UsersModule,FollowModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    PostModule,
    ChatroomModule,
    CommentModule,
    MessageModule,
    
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
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
})
export class AppModule {}
