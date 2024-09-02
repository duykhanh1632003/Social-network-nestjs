import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from 'src/db/entity/follow.entity';
import { FollowRepository } from 'src/repo/follow.repository';
import { AuthRepository } from 'src/repo/auth.repository';
import { User } from 'src/db/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Follow,FollowRepository, AuthRepository,User])],
  controllers: [FollowController],
  providers: [FollowService, FollowRepository, AuthRepository],
  exports: [FollowRepository,FollowModule]
})
export class FollowModule {}
