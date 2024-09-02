import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MulterModule.register({
    dest: "./static/images",
    limits: { fieldSize: 100000000 }
  }),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
