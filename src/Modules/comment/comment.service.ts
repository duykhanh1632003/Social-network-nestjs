import { Injectable } from '@nestjs/common';
import { User } from 'src/db/entity/user.entity';
import { CommentInfoDto, CommentInfoListDto } from 'src/dto/comment/comment-info.dto';
import { CreateCommentDto } from 'src/dto/comment/create-comment.dto';
import { UpdateCommentDto } from 'src/dto/comment/update-comment.dto';
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

    async updateComment(updateCommentDto: UpdateCommentDto, user: User): Promise<CommentInfoDto> {
        return this.commentRepository.updateComment(updateCommentDto , user)
    }

    async deleteComment(id: number, user: User): Promise<void> {
        return this.commentRepository.deleteComment(id , user)
    }
}
