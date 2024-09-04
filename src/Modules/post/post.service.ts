import { Injectable } from '@nestjs/common';
import { User } from 'src/db/entity/user.entity';
import { CreatePostDto } from 'src/dto/post/create-post.dto';
import { PostIdDto } from 'src/dto/post/post-id.dto';
import { PostInfoDto, PostResponse } from 'src/dto/post/post-info.dto';
import { PostLikeCountDto } from 'src/dto/post/post-like-count.dto';
import { UpdatePostDescriptionDto } from 'src/dto/post/update-post-description.dto';
import { AuthRepository } from 'src/repo/auth.repository';
import { PostRepository } from 'src/repo/post.repository';
import { UserRepository } from 'src/repo/user.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,

  ) { }
  
  async createPost(createPost: CreatePostDto, user: User, imageUrls: string[]): Promise<PostInfoDto> {
    return this.postRepository.createPost(createPost, user,imageUrls)
  }

  async getPostList(email: string, page: number, limit: number): Promise<PostResponse> {
    const postListResponse = await this.postRepository.getPostList(email, page, limit)

    return postListResponse
  }

  async updatePostDescription(email: string, updatePostDescriptionDto: UpdatePostDescriptionDto): Promise<PostInfoDto> {
    return await this.postRepository.updatePostDescription(email, updatePostDescriptionDto)
  }

  async getPostListByUser(email: string, page: number, limit: number): Promise<PostResponse> {
    return await this.postRepository.getPostListByUser(email, page, limit)
  }
  async likeUnlikePost(postId: PostIdDto, email: string): Promise<PostLikeCountDto> {
    return this.postRepository.likeUnlikePost(postId, email)
  }

  async getPostById(email: string, id: number): Promise<PostInfoDto> {
    return await this.postRepository.getPostById(email, id )
  }

  async deletePost(id: number, user: User): Promise<void> {
    return await this.postRepository.deletePost(id, user )
  }

  async updatePostStatus(email: string, id: number): Promise<void> {
    return await this.postRepository.updatePostStatus(email, id )
  }

  async createDummyPosts(email?: string): Promise<void> {
    const count = 10;
    const user = await this.authRepository.findOne({ email })
    
    let users = []
    let duplicatedUsers = []
    let shuffledUsers = []
    
    if (user) {
      
    }
  }

}
