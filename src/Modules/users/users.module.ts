import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './user.controller';
import { UserRepository } from 'src/repo/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/entity/user.entity';
import { PostEntity } from 'src/db/entity/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    TypeOrmModule.forFeature([
      User,
      PostEntity,
      UserRepository])
  ],
  controllers: [UserController],
  providers: [UsersService,UserRepository, UserRepository]
})
export class UsersModule {}
