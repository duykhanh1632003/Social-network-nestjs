import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { CommentType } from "src/enum/comment-typ.enum";
import { UserSimpleInfoDto } from "../user/user-simple-info.dto";

export class CommentInfoDto {

    @ApiProperty({
        example: 1,
        description: `The ID of the comment.`,
    })
    id: number;
    
    @ApiProperty({
      example: 'khanh',
      description: `The comment's content`,
    })
    content: string;
    
    @ApiProperty({
        example: CommentType.Comment,
        description: `The type of the comment.`,
    })
    type: CommentType;
    
    @ApiProperty({
        example: 1,
        description: `The ID of the parent comment for this reply. It can be null.`,
    })
    parentCommentId: number;
    
    @ApiProperty({
        example: 'khanh@gmail.com',
        description: `The email of the parent comment's author for this reply. It can be null.`,
    })
    parentCommentAuthor: string;
    
    @ApiProperty({
        example: 1,
        description: `The ID of the post for this comment.`,
    })
    @IsNotEmpty()
    postId: number;
      
    @ApiProperty({
        example: `khanh@gmail.com`,
        description: `The email of its author.`,
    })
    @IsNotEmpty()
    user: UserSimpleInfoDto;
    
    @ApiProperty({
        example: `2022-06-12 06:00:22.206Z`,
        description: `The created date the comment.`,
    })
    @IsNotEmpty()
    createdAt: Date;
    
    @ApiProperty({
        example: `2022-06-12 06:00:22.206Z`,
        description: `The updated date the comment.`,
    })
    @IsNotEmpty()
    updatedAt: Date;
    
    @ApiProperty({
        example: 3,
        description: `The replies count of the comment`,
    })
    childrenCount: number;
    
}

export class CommentInfoListDto {
    
    @ApiProperty({ type: [CommentInfoDto] })
    comments: CommentInfoDto[];

    @ApiProperty({
        example: 10,
        description: `The comment's total count can call`,
    })
    total: number;
}