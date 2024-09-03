import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/repo/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository,])],
  controllers: [ChatroomController],
  providers: [ChatroomService],
})
export class ChatroomModule {}
