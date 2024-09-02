import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PostService } from './post.service';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostInfoDto } from 'src/dto/post/post-info.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/db/entity/user.entity';
import { editFileName, imageFileFilter } from 'src/lib/multerOptions';
import { CreatePostDto } from 'src/dto/post/create-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService, private readonly configService: ConfigService) {}

  @ApiResponse({
    type: PostInfoDto,
    status: 200,
    description: 'Success'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePostDto })
  @ApiOperation({ summary: 'Create a new post' })
  @UseInterceptors(
    FilesInterceptor('files', 4, {
      storage: diskStorage({
        destination: './static/images',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: User,
    @UploadedFile() files: Array<Express.Multer.File>,
  ): Promise<PostInfoDto> {
    const imageUrls = files.map(
      (file) => `${this.configService.get<string>('SERVER_URL')}/images/${file.filename}`,
    );

    return this.postService.createPost(createPostDto, user, imageUrls);
  }

  

}
