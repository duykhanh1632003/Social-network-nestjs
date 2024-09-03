import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('comment')
@ApiTags  ('Comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  
}
