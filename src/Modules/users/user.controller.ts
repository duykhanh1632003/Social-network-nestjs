import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/passport/jwt-auth.guard";
import { LoggerService } from './../../logger/logger.service';
import { UsersService } from "./users.service";
import { UserInfoDto } from "src/dto/user/user-info.dto";
import { User } from "src/db/entity/user.entity";
import { GetUser } from "src/decorator/get-user.decorator";
import { UserInfoIncludingIsFollowingDto } from "src/dto/user/user-info-including-isfollowing.dto";
import { PostIdDto } from "src/dto/post/post-id.dto";
import { UpdatedUserThumbnailDto } from "src/dto/user/updated-user-thumbnail.dto";
import { diskStorage } from "multer";
import { editFileName, imageFileFilter } from "src/lib/multerOptions";
import { FileInterceptor } from "@nestjs/platform-express";
import { ConfigService } from "@nestjs/config";
import { StatusMessageDto } from "src/dto/user/status-message.dto";
import { UserListDto } from "src/dto/user/user-list.dto";

@ApiTags('USER')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(
        private readonly logger: LoggerService,
        private readonly userService: UsersService,
        private readonly configService: ConfigService
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

  @ApiResponse({
    type: UpdatedUserThumbnailDto,
    status: 200,
    description: 'Success',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'User thumbnail',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Update user thumbnail' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './static/images',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @Patch('thumbnail')
  updateUserThumbnail(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UpdatedUserThumbnailDto> {
    return this.userService.updateUserThumbnail(
      user.email,
      `${this.configService.get<string>('serverUrl')}/images/${file.filename}`,
    );
    }
    
    @ApiResponse({
        status: 200,
        description: "Success"
    })
    @ApiOperation({ summary: "Delete the user thumbnail"})
    @Delete("/thumbnail")
    deleteThumbnail(
        @GetUser() user: User,
    ): Promise<UpdatedUserThumbnailDto> {
        return this.userService.deleteThumbnail(user);
    }

    @ApiResponse({
        status: 200,
        description: "Success"
    })
    @ApiBody({ type: StatusMessageDto })
    @ApiOperation({ summary: `Update user's status message` })
    @Patch('/statusMessage')
    updateStatusMessage(
        @GetUser() user: User,
        @Body() statusMessageDto: StatusMessageDto
    ): Promise<void> {
        return this.userService.updateStatusMessage(user.email, statusMessageDto.statusMessage)
    }

    @ApiResponse({
        type: UserListDto,
        status: 200,
        description: "Success"
    })
    @ApiQuery({
        name: "keyword",
        example: "Khanh",
        description: "User name search"
    })
    @ApiQuery({
        name: "page",
        example: "1",
        description: "Page of the list user"
    })
    @ApiQuery({
        name: "limit",
        example: "10",
        description: "Limit user per page"
    })
    @ApiOperation({ summary: "Find user" })
    @Get("/search/user")
    getUserListByKeyWord(
        @GetUser() user: User,
        @Query("keyword") keyword: string,
        @Query("page") page: number,
        @Query('limit') limit: number
    ): Promise<UserListDto> {
        return this.userService.getUserListByKeyWord(user,keyword, page, limit)
    }

   
    
}   
