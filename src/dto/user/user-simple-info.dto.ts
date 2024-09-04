import { ApiProperty } from "@nestjs/swagger";

export class UserSimpleInfoDto {
    @ApiProperty({
        example: "khanh@gmail.com",
        description: `User's email address`
    })
    email: string

    @ApiProperty({
        example: "khanh",
        description: `User's name`,
    })
    username: string

    @ApiProperty({
        example: 'https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg',
        description: `User's thumbnail url`,
    })
    thumbnail: string
}