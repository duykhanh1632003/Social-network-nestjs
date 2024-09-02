import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from 'src/db/entity/follow.entity';
import { FollowRepository } from 'src/repo/follow.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Follow,FollowRepository])],
  controllers: [FollowController],
  providers: [FollowService, FollowRepository],
  exports: [FollowRepository,FollowModule]
})
export class FollowModule {}
