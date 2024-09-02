import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FollowService } from './follow.service';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}
  
 
}
