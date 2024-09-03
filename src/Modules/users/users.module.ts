import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './user.controller';
import { UserRepository } from 'src/repo/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/entity/user.entity';
import { PostEntity } from 'src/db/entity/post.entity';
import { FollowRepository } from 'src/repo/follow.repository';
import { Follow } from 'src/db/entity/follow.entity';
import { PostRepository } from 'src/repo/post.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      PostEntity,
      UserRepository,
      FollowRepository,
      Follow,
      PostRepository,
    ])
  ],
  controllers: [UserController],
  providers: [UsersService,UserRepository, UserRepository,FollowRepository, PostRepository]
})
export class UsersModule {}
