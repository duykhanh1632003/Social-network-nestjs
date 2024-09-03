import { ApiProperty } from "@nestjs/swagger";

export class ChatRoomDto {
    @ApiProperty({
        example: 13,
        description: `Chatroom's ID`
    })
    id: number

    @ApiProperty({
        example: "John",
        description: `Chatroom's name`,
    })
    name: string;
}