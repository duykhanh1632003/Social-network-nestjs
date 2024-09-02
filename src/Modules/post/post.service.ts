import { Injectable } from '@nestjs/common';
import { User } from 'src/db/entity/user.entity';
import { CreatePostDto } from 'src/dto/post/create-post.dto';
import { PostInfoDto } from 'src/dto/post/post-info.dto';
import { PostRepository } from 'src/repo/post.repository';

@Injectable()
export class PostService {
  constructor(
   private readonly postRepository: PostRepository
  ) { }
  
  async createPost(createPost: CreatePostDto, user: User, imageUrls: string[]): Promise<PostInfoDto> {
    return this.postRepository.createPost(createPost, user,imageUrls)
  }
}
