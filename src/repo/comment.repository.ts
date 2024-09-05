import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import moment from "moment";
import { CommentEntity } from "src/db/entity/comment.entity";
import { PostEntity } from "src/db/entity/post.entity";
import { User } from "src/db/entity/user.entity";
import { CommentInfoDto, CommentInfoListDto } from "src/dto/comment/comment-info.dto";
import { CreateCommentDto } from "src/dto/comment/create-comment.dto";
import { UserSimpleInfoDto } from "src/dto/user/user-simple-info.dto";
import { CommentType } from "src/enum/comment-typ.enum";
import { LoggerService } from "src/logger/logger.service";
import { Repository } from "typeorm";

@Injectable()
export class CommentRepository {
    constructor(
    @InjectRepository(CommentEntity) private readonly commentRepo: Repository<CommentEntity>, 
    @InjectRepository(PostEntity) private readonly postRepo: Repository<PostEntity>,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext('FollowRepository');
  }
  async getPostById(id: number): Promise<PostEntity> {
        const post = await this.postRepo.findOne({ where: { id: id }});

        if (!post) {
            this.logger.error(`Can't find Post with id ${id}`);
            throw new NotFoundException(`Can't find Post with id ${id}`);
        }

        this.logger.verbose(`post : ${post}`);
        return post;
    }

  async createComment(createCommentDto: CreateCommentDto, user: User): Promise<CommentInfoDto> {
    const post = await this.getPostById(createCommentDto.postId);

    const { content, parentCommentId, parentCommentAuthor } = createCommentDto;
    const createdAt = moment().tz('Asia/VietNam').format('YYYY-MM-DD HH:mm:ss.SSS');
    const date = new Date(createdAt);

    const comment = this.commentRepo.create({
        content,
        type: createCommentDto.parentCommentId == null ? CommentType.Comment : CommentType.Reply,
        parentCommentId,
        parentCommentAuthor,
        post,
        user,
        createdAt: date,
        updatedAt: date,
    });
    
    await this.commentRepo.save(comment);

    const created = new CommentInfoDto();
    created.id = comment.id;
    created.content = comment.content;
    created.type = comment.type;
    created.parentCommentId = comment.parentCommentId;
    created.parentCommentAuthor = comment.parentCommentAuthor;
    created.postId = comment.post.id;
    created.user = new UserSimpleInfoDto();
    created.user.email = comment.user.email;
    created.user.thumbnail = comment.user.thumbnail;
    created.user.username = comment.user.username;
    created.createdAt = comment.createdAt;
    created.updatedAt = comment.updatedAt;

    return created;
      
  }

  async getCommentList(postId: number, page: number, limit: number): Promise<CommentInfoListDto> {
    const query = this.commentRepo.
      createQueryBuilder("comment_entity").
      leftJoinAndSelect('comment_entity.post', 'post').
      leftJoinAndSelect('comment_entity.user', 'user')
      .leftJoin('comment_entity.childComments', 'children')
      .loadRelationCountAndMap('comment_entity.childrenCount', 'comment_entity.childComments')
      .where('comment_entity.postId = :postId', { postId })
      .andWhere('comment_entity.type = :type', { type: CommentType.Comment })
      .orderBy('comment_entity.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
    
    const [comments, total] = await query.getManyAndCount()

    const commentList: CommentInfoDto[] = comments.map((comment: CommentEntity) => {
      const commentInfo: CommentInfoDto = new CommentInfoDto();
      commentInfo.id = comment.id;
      commentInfo.content = comment.content;
      commentInfo.type = comment.type;
      commentInfo.parentCommentId = comment.parentCommentId;
      commentInfo.parentCommentAuthor = comment.parentCommentAuthor;
      commentInfo.postId = comment.post.id;
      commentInfo.user = new UserSimpleInfoDto();
      commentInfo.user.email = comment.user.email;
      commentInfo.user.thumbnail = comment.user.thumbnail;
      commentInfo.user.username = comment.user.username;
      commentInfo.createdAt = comment.createdAt;
      commentInfo.updatedAt = comment.updatedAt;
      commentInfo.childrenCount = comment.childrenCount;
      return commentInfo;
    });
  
    return { comments: commentList, total };
  }

  async getReplyListByParentCommentId(parentCommentId: number, postId: number, page: number, limit: number): Promise<CommentInfoListDto> {
    const query = this.commentRepo.createQueryBuilder('comment_entity')
      .leftJoinAndSelect('comment_entity.post', 'post')
      .leftJoinAndSelect('comment_entity.user', 'user')
      .where('comment_entity.postId = :postId', { postId })
      .andWhere('comment_entity.parentCommentId = :parentCommentId', { parentCommentId })
      .andWhere('comment_entity.type = :type', { type: CommentType.Reply })
      .orderBy('comment_entity.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    
    const [comments, total] = await query.getManyAndCount();
        
    const commentList: CommentInfoDto[] = comments.map((comment: CommentEntity) => {
      const commentInfo: CommentInfoDto = new CommentInfoDto();
      commentInfo.id = comment.id;
      commentInfo.content = comment.content;
      commentInfo.type = comment.type;
      commentInfo.parentCommentId = comment.parentCommentId;
      commentInfo.parentCommentAuthor = comment.parentCommentAuthor;
      commentInfo.postId = comment.post.id;
      commentInfo.user = new UserSimpleInfoDto();
      commentInfo.user.email = comment.user.email;
      commentInfo.user.thumbnail = comment.user.thumbnail;
      commentInfo.user.username = comment.user.username;
      commentInfo.createdAt = comment.createdAt;
      commentInfo.updatedAt = comment.updatedAt;
      return commentInfo;
    });
        
    return { comments: commentList, total };
  }

  

}