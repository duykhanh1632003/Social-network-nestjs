import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from 'src/db/entity/comment.entity';
import { CommentRepository } from 'src/repo/comment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, CommentRepository])],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
  exports: [CommentRepository,CommentModule]
})
export class CommentModule {}
