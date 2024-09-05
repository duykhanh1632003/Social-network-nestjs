import { Injectable } from '@nestjs/common';
import { User } from 'src/db/entity/user.entity';
import { CommentInfoDto, CommentInfoListDto } from 'src/dto/comment/comment-info.dto';
import { CreateCommentDto } from 'src/dto/comment/create-comment.dto';
import { CommentRepository } from 'src/repo/comment.repository';
import { PostRepository } from 'src/repo/post.repository';

@Injectable()
export class CommentService {
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly postRepository: PostRepository
    ) { }   
    async createComment(createCommentDto: CreateCommentDto, user: User): Promise<CommentInfoDto> {
        return this.commentRepository.createComment(createCommentDto, user)
    }

    async getCommentList(postId: number, page: number, limit: number): Promise<CommentInfoListDto> {
        return this.commentRepository.getCommentList(postId, page, limit)
    }

    async getReplyListByParentCommentId(parentCommentId: number, postId: number, page: number, limit: number): Promise<CommentInfoListDto> {
        return this.commentRepository.getReplyListByParentCommentId(parentCommentId, postId, page, limit)
    }
}
