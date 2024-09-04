import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdatePostDescriptionDto {

    @ApiProperty({
        example: `Post's ID`,
        description: `Post's description`
    })
    @IsNotEmpty()
    postId: number

    @ApiProperty({
        example: 'Write a description here',
        description: "hello many friends"
    })
    @IsNotEmpty()
    description: string
}