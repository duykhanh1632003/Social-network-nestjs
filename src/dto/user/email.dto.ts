import { ApiProperty } from "@nestjs/swagger";

export class EmailDto {
    @ApiProperty({
        description: `The user's email address`,
        example: `khanh@gmail.com`,
    })
    email: string
}