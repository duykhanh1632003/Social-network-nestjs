import { LoggerService } from "src/logger/logger.service";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException, Post } from "@nestjs/common";
import { PostEntity } from "src/db/entity/post.entity";
import { ConfigService } from "@nestjs/config";
import { User } from "src/db/entity/user.entity";
import { PostInfoDto } from "src/dto/post/post-info.dto";
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
}
