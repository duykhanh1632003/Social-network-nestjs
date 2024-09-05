import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentInfoDto, CommentInfoListDto } from 'src/dto/comment/comment-info.dto';
import { CreateCommentDto } from 'src/dto/comment/create-comment.dto';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/db/entity/user.entity';
import { UpdateCommentDto } from 'src/dto/comment/update-comment.dto';

@Controller('comment')
@ApiTags  ('Comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiResponse({
    type: CommentInfoDto,
    status: 201,
    description: "Success"
  })
  @ApiBody({ type: CreateCommentDto })
  @ApiOperation({ summary: "Create comments or relies. A Comment represents a comment on a post, while a Reply represents a comment on a Comment"})
  @Post("/")
  createComment(
    @Body() commentInfoDto: CommentInfoDto,
    @GetUser() user: User
  ): Promise<CommentInfoDto> {
    return this.commentService.createComment(commentInfoDto, user)
  }

  @ApiResponse({
    type: CommentInfoListDto,
    status: 200,
    description: "Success"
  })
  @ApiQuery({
    name: "postId",
    required: true,
    description: `The post's ID`
  })
  @ApiQuery({
    name: "page",
    required: true,
    description: `The page's number to call`
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    description: `The number of items on a single page`
  })
  @ApiOperation({ summary: 'Get comments list of the post' })
  @Get('/')
  getCommentList(
    @Query('postId', ParseIntPipe) postId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number
  ): Promise<CommentInfoListDto> {
    return this.commentService.getCommentList(postId, page, limit)
  }

  @ApiResponse({
    type: CommentInfoListDto,
    status: 200,
    description: 'Success'
  })
  @ApiQuery({
    name: 'parentCommentId',
    required: true,
    description: `The parent comment's ID`
  })
  @ApiQuery({
    name: 'page',
    description: `The page's number to call`,
    required: true,
  })
  @ApiQuery({
    name: 'limit',
    description: `The number of items on a single page`,
    required: true,
  })
  @ApiOperation({ summary: `Get reply list of the parent comment` })
  @Get('/reply')
  getReplyListByParentCommentId(
    @Query('parentCommentId', ParseIntPipe) parentCommentId: number,
    @Query('postId', ParseIntPipe) postId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<CommentInfoListDto> {
      return this.commentService.getReplyListByParentCommentId(parentCommentId, postId, page, limit);
  }

  @ApiResponse({
    status: 201,
    description: "Success"
  })
  @ApiBody({ type: UpdateCommentDto })
  @ApiOperation({ summary: `Update the comment's content ` })
  @Patch('/')
  updateComment(
    @Body() updateCommentDto: UpdateCommentDto,
    @GetUser() user: User
  ): Promise<CommentInfoDto> {
    return this.commentService.updateComment(updateCommentDto, user)
  }

  @ApiResponse({
        status: 200,
        description: 'Success',
    })
    @ApiParam({
      name: 'id',
      required: true,
      description: 'The comment ID to delete',
    })
    @ApiOperation({ summary: `Delete the comment by ID` })
    @Delete('/:id')
    deleteComment(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<void> {
        return this.commentService.deleteComment(id, user);
    }
  
}
