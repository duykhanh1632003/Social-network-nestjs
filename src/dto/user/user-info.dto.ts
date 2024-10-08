import { ApiProperty } from "@nestjs/swagger";

export class UserInfoDto {

  @ApiProperty({
    example: 'khanh@gmail.com',
    description: `User's email address`,
  })
  email: string;

  @ApiProperty({
    example: 'khanh',
    description: `User's name`,
  })
  username: string;

  @ApiProperty({
    example: 'https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg',
    description: `User's thumbnail url`,
  })
  thumbnail: string;

  @ApiProperty({
    example: [1,2],
    description: `The list of post IDs that user has bookmarked`,
  })
  bookMarks: number[];

  @ApiProperty({
    example: `I'm hungry`,
    description: `User's status message`,
  })
  statusMessage: string;

  @ApiProperty({
    example: 5,
    description: `The number of user's feed`,
  })
  totalPostCount: number;

  @ApiProperty({
    example: 5,
    description: `The number of user's followers`,
  })
  followerCount: number;

  @ApiProperty({
    example: 7,
    description: `The number of user's followings`,
  })
  followingCount: number;

}