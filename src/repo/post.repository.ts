import { LoggerService } from "src/logger/logger.service";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PostEntity } from "src/db/entity/post.entity";
import { ConfigService } from "@nestjs/config";
import { User } from "src/db/entity/user.entity";
import { PostInfoDto, PostResponse } from "src/dto/post/post-info.dto";
import moment from "moment";
import { PostStatus } from "src/enum/post-status.enum";
import { UserInfoDto } from "src/dto/user/user-info.dto";
import { CreatePostDto } from "src/dto/post/create-post.dto";
import { UpdatePostDescriptionDto } from "src/dto/post/update-post-description.dto";
import { groupBy } from "rxjs";
import { PostIdDto } from "src/dto/post/post-id.dto";
import { PostLikeCountDto } from "src/dto/post/post-like-count.dto";

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

  async postBookMark(email: string, postId: number): Promise<string[]> {
    const post = await this.postRepo.findOne({
      where: { id : postId }
    })
    if (post) {
      if (!post.bookMarkedUsers.includes(email)) {
        post.bookMarkedUsers.push(email)
      }
      else {
        post.bookMarkedUsers = post.bookMarkedUsers.filter((like) => like !== email);
    }
    await this.postRepo.save(post)
      return post.bookMarkedUsers;
    }
    else {
      throw new NotFoundException(`Can't find Post with id ${postId}`);
    }
    
  }

  async updatePostDescription(email: string, updatePostDescriptionDto: UpdatePostDescriptionDto): Promise<PostInfoDto> {
    const post = await this.postRepo.createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoin('post.comments', 'comment_entity')
      .loadRelationCountAndMap('post.commentCount', 'post.comments')
      .where('post.id = :id', { id: updatePostDescriptionDto.postId })
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
      .getOne()
    
    if (post) {
      if (post.user.email != email) {
          throw new UnauthorizedException();
      }
      post.description = updatePostDescriptionDto.description
      this.postRepo.save(post)

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
      postInfo.likeCount = post.likes.length;
      postInfo.isLiked = post.likes.includes(email);
      postInfo.isBookmarked = post.bookMarkedUsers.includes(email);
      postInfo.commentCount = post.commentCount;
      return postInfo;
    }
    else {
      throw new NotFoundException(`Can't find Post with id ${updatePostDescriptionDto.postId}`);
    }
  } 

  async getPostListByUser(email: string, page: number, limit: number): Promise<PostResponse> {
    const query = this.postRepo
      .createQueryBuilder("post")
      .leftJoinAndSelect('post.user', 'user')
      .leftJoin('post.comments', 'comment_entity')
      .loadRelationCountAndMap('post.commentCount', 'post.comments')
      .where('user.email = :email', { email })
      .andWhere('post.status = :status', { status: PostStatus.PUBLIC })
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
      ]).
      groupBy('post.id')
      .addGroupBy('user.email')
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
    
    const [posts, total] = await query.getManyAndCount();
        
        const postList: PostInfoDto[] = posts.map((post: PostEntity) => {
            const postInfo: PostInfoDto = new PostInfoDto();
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
            postInfo.likeCount = post.likes.length;
            postInfo.isLiked = post.likes.includes(email);
            postInfo.isBookmarked = post.bookMarkedUsers.includes(email);
            postInfo.commentCount = post.commentCount;
            return postInfo;
        });

    return { posts: postList, total };
  }

  async likeUnlikePost(postId: PostIdDto, email: string): Promise<PostLikeCountDto> {
    const post = await this.postRepo.findOne({ where: { id: postId.postId } })
    if (post) {
      if (!post.likes.includes(email)) {
        post.likes.push(email)
      }
      else {
        post.likes.filter((like) => like !== email)
      }
      await this.postRepo.save(post)
    const postLikeCount = new PostLikeCountDto()
    postLikeCount.likeCount = post.likes.length

    return postLikeCount
    }
    else {
      throw new NotFoundException(`Can't find`)
    }
    
  }

  async getPostById(email: string, id: number): Promise<PostInfoDto> {
    const post = await this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect("post.user", 'user')
      .leftJoin('post.comments', 'comment_entity')
      .loadRelationCountAndMap('post.commentCount', 'post.comments').where('post.id = :id', { id })
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
      .getOne()
    if (!post) {
      this.logger.error(`Can't find Post with id ${id}`);
      throw new NotFoundException(`Can't find Post with id ${id}`);
    }
    const postInfo: PostInfoDto = new PostInfoDto();
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
    postInfo.likeCount = post.likes.length;
    postInfo.isLiked = post.likes.includes(email);
    postInfo.isBookmarked = post.bookMarkedUsers.includes(email);
    postInfo.commentCount = post.commentCount;
  
    this.logger.verbose(`post : ${postInfo}`);
    return postInfo;
  }

  async deletePost(id: number, user: User): Promise<void> {
    // Find the post by ID and ensure it's associated with the current user
    const post = await this.postRepo.findOne({ where: { id, user } });

    if (!post) {
      throw new Error('Post not found or you do not have permission to delete this post');
    }

    // Delete the post
    await this.postRepo.delete(id);
  }

  async updatePostStatus(email: string, id: number): Promise<void> {
    const post = await this.getPostById(email, id)
    post.status = post.status == PostStatus.PUBLIC ? PostStatus.PRIVATE : PostStatus.PUBLIC;
    await this.postRepo.save(post);
  }
  
}
