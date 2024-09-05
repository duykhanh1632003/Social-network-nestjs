import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FollowService } from './follow.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmailDto } from 'src/dto/user/email.dto';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/db/entity/user.entity';
import { SingleIntegerDto } from 'src/dto/follow/single-integer.dto';
import { UserListDto } from 'src/dto/user/user-list.dto';

@Controller('follow')
@ApiTags('Follow')
@ApiBearerAuth('access-token')

export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @ApiResponse({
    type: SingleIntegerDto,
    status: 201,
    description: "Total follower count"
  })
  @ApiBody({ type: EmailDto })
  @ApiOperation({ summary: `Create follow` })
  @Post("/")
  async createFollow(@GetUser() user: User, @Body() emailDto: EmailDto): Promise<SingleIntegerDto> {
    return this.followService.createFollow(user, emailDto.email)
  }

  /// It returns the current user following the user, or not
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiQuery({
    name: 'email',
    description: `The other user's email`,
    required: true,
  })
  @ApiOperation({ summary: `Check if the user is following another user` })
  @Get('/is-following')
  async getIsFollowing(
    @GetUser() user: User,
    @Query('email') email: string,
  ): Promise<boolean> {
    return this.followService.getIsFollowing(user.email, email);
  }

  @ApiResponse({
    type: Number,
    status: 200,
    description: 'Total follower count'
  })
  @ApiOperation({ summary: 'Get total follower count' })
  @Get("/follower/count")
  async getFollowerCount(@GetUser() user: User): Promise<number> {
    return this.followService.getFollowerCount(user.email)
  }
  @ApiResponse({
    type: Number,
    status: 200,
    description: 'Total following count',
  })
  @ApiOperation({ summary: `Get total following count` })
  @Get('/following/count')
  async getFollowingCount(@GetUser() user: User): Promise<number> {
    return this.followService.getFollowingCount(user.email);
  }

  @ApiResponse({
    type: UserListDto,
    status: 200,
    description: 'SUccess'
  })
  @ApiQuery({
    name: 'email',
    description: `User's email address to fetch`,
    required: true
  })
  @ApiProperty({
    name: 'page',
    description: `The page's number to call`,
    required: true
  })
  @ApiProperty({
    name: 'limit',
    description: `The number of items on a single page`,
    required: true
  })
  @ApiOperation({ summary: "Get follower list" })
  @Get('/follower')
  getFollowerList(
    @Query('email') email: string,
    @Query('page') page: number,
    @Query('limit') limit: number
  ): Promise<UserListDto> {
    return this.followService.getFollowerList(email, page, limit);
  }

  

  
}
