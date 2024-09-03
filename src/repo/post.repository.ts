import { LoggerService } from "src/logger/logger.service";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException, Post } from "@nestjs/common";
import { PostEntity } from "src/db/entity/post.entity";
import { ConfigService } from "@nestjs/config";
import { User } from "src/db/entity/user.entity";
import { PostInfoDto, PostResponse } from "src/dto/post/post-info.dto";
import moment from "moment";
import { PostStatus } from "src/enum/post-status.enum";
import { UserInfoDto } from "src/dto/user/user-info.dto";
import { CreatePostDto } from "src/dto/post/create-post.dto";

@Injectable()
export class PostRepository  {
  constructor(
      @InjectRepository(PostEntity) private readonly postRepo: Repository<PostEntity>, 
      private readonly configService: ConfigService,
      private readonly logger: LoggerService
  ) {
    this.logger.setContext('PostRepository');
  }
  
    async createPost(createPostDto: CreatePostDto, user: User, imageUrls: string[]): Promise<PostInfoDto> {
        const { description } = createPostDto;

        const createdAt = moment().tz('Asia/VietNam').format('YYYY-MM-DD HH:mm:ss.SSS');

        const post = this.postRepo.create({
            description,
            status: PostStatus.PUBLIC,
            user,
            createdAt,
            updatedAt: createdAt,
            imageUrls,
            likes: [],
            bookMarkedUsers: []
        })

        await this.postRepo.save(post)

        this.logger.verbose(`${user.email}'s new post has created.`);

        const postInfo: PostInfoDto = new PostInfoDto()
        postInfo.id = post.id;
        postInfo.description = post.description;
        postInfo.status = post.status;
        postInfo.user = new UserInfoDto();
        postInfo.user.email = post.user.email;
        postInfo.user.username = post.user.username;
        postInfo.user.thumbnail = post.user.thumbnail;
        postInfo.createdAt = post.createdAt;
        postInfo.updatedAt = post.updatedAt;
        postInfo.imageUrls = post.imageUrls;
        postInfo.isLiked = false;
        postInfo.isBookmarked = false;
        postInfo.commentCount = post.commentCount;

        return postInfo
  }
  
  async getPostList(email: string, page: number, limit: number): Promise<PostResponse> {
    const query = this
      .postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoin('post.comments', 'comment_entity')
      .loadRelationCountAndMap('post.commentCount', 'post.comments')
      .where('post.status = :status', { status: PostStatus.PUBLIC })
      .select([
        'post.id',
        'post.description',
        'post.status',
        'post.createdAt',
        'post.imageUrls',
        'post.likes',
        'post.bookMarkedUsers',
        'user.username',
        'user.email',
        'user.thumbnail',
        'COUNT(comment_entity.id) as commentCount',
      ])
      .groupBy('post.id')
      .addGroupBy('user.email')
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
    
    const [posts, total] = await query.getManyAndCount()

    const postList: PostInfoDto[] = posts.map((post: PostEntity) => {
      const postInfo: PostInfoDto = new PostInfoDto()
      postInfo.id = post.id;
      postInfo.description = post.description;
      postInfo.status = post.status;
      postInfo.user = new UserInfoDto()
      postInfo.user.email = post.user.email;
      postInfo.user.username = post.user.username;
      postInfo.user.thumbnail = post.user.thumbnail;
      postInfo.createdAt = post.createdAt;
      postInfo.updatedAt = post.updatedAt;
      postInfo.imageUrls = post.imageUrls;
      postInfo.likeCount = post.likes.length;
      postInfo.isLiked = post.likes.includes(email)
      postInfo.isBookmarked = post.bookMarkedUsers.includes(email)
      postInfo.commentCount = post.commentCount;
      return postInfo
    })
    return { posts: postList, total };
  }
}
