import { ApiProperty } from "@nestjs/swagger";

export class UpdatedUserThumbnailDto {
    
    @ApiProperty({
        example: 'https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg',
        description: `User's updated thumbnail url`,
    })
    updatedThumbnail: string
}