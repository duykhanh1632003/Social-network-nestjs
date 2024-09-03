import { ApiProperty } from "@nestjs/swagger";
import { UserSimpleInfoDto } from "./user-simple-info.dto";

export class UserSimpleInfoIncludingStatusMessageDto extends UserSimpleInfoDto {

    @ApiProperty({
        example: "Khanh duy",
        description : `User's status message`
    })
    statusMessage: string

    @ApiProperty({
        example: 'A1',
        description: `Chatroom's name`
    })
    name: string

    @ApiProperty({
        example: "e co dua kia",
        description: `Chatroom's last message`
    })
    latestMessage: string

    @ApiProperty({
        example: [`khanh@gmai.com`, `dung@gmai.com`],
        description: `Participants's email addresses`
    })
    participants: string[]

    @ApiProperty({
        example: `2022-06-12 06:00:22.206Z`,
        description: `The chatroom's created date`,
    })
    createdAt: Date

    @ApiProperty({
        example: `2022-06-12 06:00:22.206Z`,
        description: `The chatroom's updated date`,
    })
    updatedAt: Date;
}

export class ChatRoomListDto {
    @ApiProperty({
        type: [ChatRoomListDto]
    })
    list: ChatRoomListDto[]

    @ApiProperty({
        example: 10,
        description: `The chat room's total count`,
    })
    total: number;
}