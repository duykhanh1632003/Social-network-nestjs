import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/passport/jwt-auth.guard";
import { LoggerService } from './../../logger/logger.service';
import { UsersService } from "./users.service";
import { UserInfoDto } from "src/dto/user/user-info.dto";
import { User } from "src/db/entity/user.entity";
import { GetUser } from "src/decorator/get-user.decorator";
import { UserInfoIncludingIsFollowingDto } from "src/dto/user/user-info-including-isfollowing.dto";
import { PostIdDto } from "src/dto/post/post-id.dto";
import { UpdatedUserThumbnailDto } from "src/dto/user/updated-user-thumbnail.dto";

@ApiTags('USER')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(
        private readonly logger: LoggerService,
        private readonly userService: UsersService
    ) { }
    
    /// Get my user information
    @ApiResponse({
        type: UserInfoDto,
        status: 200,
        description: 'Success',
    })
    @ApiOperation({ summary: `Get my information` })
    @Get('/')
    getMyInfo(
        @GetUser() user: User,
    ): Promise<UserInfoDto> {
        this.logger.verbose(`User ${user.email} trying to get own information.`);
        return this.userService.getUserInfo(user.email);
    }
    
    /// get other people information
    /// it's not for current user
    /// If you want to get current user's information, use getMyInfo()
    @ApiResponse({
        type: UserInfoIncludingIsFollowingDto,
        status: 200,
        description: "Success"
    })
    @ApiQuery({
        name: 'userEmail',
        description: `The user's email who you're trying look up`,
        required: true
    })
    @ApiOperation({ summary: `Get other user information. it's not the current user` })
    @Get('/:userEmail')
    getUserInfoByEmail(
        @GetUser() user: User,
        @Query('userEmail') userEmail: string
    ): Promise<UserInfoIncludingIsFollowingDto> {
        return this.userService.getUserInfoByEmail(user.email, userEmail)
    }

    @ApiResponse({
        status: 201,
        description: "Success"
    })
    @ApiBody({ type: PostIdDto })
    @ApiOperation({ summary: `Bookmark the post if it hasn't been bookmarked yet, or remove the bookmark if it has already been bookmarked.` })
    @Post('/post/bookmark')
    postBookMark(
        @GetUser() user: User,
        @Body() postIdDto: PostIdDto
    ): Promise<void> {
        return this.userService.postBookMark(user.email, postIdDto.postId);
    }



}
