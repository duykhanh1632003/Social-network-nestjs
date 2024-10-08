import { ApiProperty } from "@nestjs/swagger";
import { PostStatus } from "src/enum/post-status.enum";
import { UserSimpleInfoDto } from "../user/user-simple-info.dto";

export class PostInfoDto {

    @ApiProperty({
        example: 1,
        description: `The ID of the post.`,
    })
    id: number;

    @ApiProperty({
        example: 'This is a sample post description.',
        description: `The description of the post.`,
    })
    description: string;
          
    @ApiProperty({
        example: PostStatus.PUBLIC,
        description: `The status of the post.`,
    })
    status: PostStatus;

    @ApiProperty({
        example: '2023-06-13T12:34:56Z',
        description: `The date and time when the post was created.`,
    })
    createdAt: Date;
         
    @ApiProperty({
        example: '2023-06-13T12:34:56Z',
        description: `The date and time when the post was last updated.`,
    })
    updatedAt: Date;
          
    @ApiProperty({
        example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
        description: `The URLs of the images associated with the post.`,
    })
    imageUrls: string[];

    @ApiProperty({ type: [UserSimpleInfoDto] })
    user: UserSimpleInfoDto
        
    @ApiProperty({
        example: 3,
        description: `The total like count of the post.`,
    })
    likeCount: number;
          
    @ApiProperty({
        example: true,
        description: `Indicates whether the post is liked by the user.`,
    })
    isLiked: boolean;
          
    @ApiProperty({
        example: false,
        description: `Indicates whether the post is bookmarked by the user.`,
    })
    isBookmarked: boolean;
          
    @ApiProperty({
        example: 5,
        description: `The number of comments on the post.`,
    })
    commentCount: number;
          
}

export class PostResponse {
    
    @ApiProperty({ type: [PostInfoDto] })
    posts: PostInfoDto[];

    @ApiProperty({
        example: 10,
        description: `The post's total count can call`,
    })
    total: number;
}