import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from 'src/db/entity/post.entity';
import { PostRepository } from 'src/repo/post.repository';
import { User } from 'src/db/entity/user.entity';

@Module({
  imports: [
    MulterModule.register({
    dest: "./static/images",
    limits: { fieldSize: 100000000 }
    }),
    TypeOrmModule.forFeature([PostEntity,PostRepository,User])
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository],
  exports: [PostRepository, PostModule]
})
export class PostModule {}
