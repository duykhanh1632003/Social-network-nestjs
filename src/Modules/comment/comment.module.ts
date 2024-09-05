import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from 'src/db/entity/comment.entity';
import { CommentRepository } from 'src/repo/comment.repository';
import { PostRepository } from 'src/repo/post.repository';
import { PostEntity } from 'src/db/entity/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, CommentRepository,PostRepository, PostEntity])],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository, PostRepository],
  exports: [CommentRepository,CommentModule]
})
export class CommentModule {}
