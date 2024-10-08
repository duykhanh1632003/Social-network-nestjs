import { ApiProperty } from "@nestjs/swagger";
import { UserSimpleInfoDto } from "../user/user-simple-info.dto";
import { UserSimpleInfoIncludingStatusMessageDto } from "../user/user-simple-info-including-status-message.dto";


export class ChatRoomDto {

    @ApiProperty({
        example: 13,
        description: `Chatroom's ID`,
    })
    id: number;
    
    @ApiProperty({
        example: "khanh",
        description: `Chatroom's name`,
    })
    name: string;
    
    @ApiProperty({
        example: "khanh",
        description: `Chatroom's last message`,
    })
    latestMessage: string;
    
    @ApiProperty({
        example: [`khanh@gmai.com`, `duong@gmai.com`],
        description: `Participants' email addresses`,
    })
    participants: string[];
    
    @ApiProperty({
        type: UserSimpleInfoDto,
        description: `Chat partner's information`
    })
    chatPartner: UserSimpleInfoIncludingStatusMessageDto;
    
    @ApiProperty({
        example: `2022-06-12 06:00:22.206Z`,
        description: `The chatroom's created date`,
    })
    createdAt: Date;
    
    @ApiProperty({
        example: `2022-06-12 06:00:22.206Z`,
        description: `The chatroom's updated date`,
    })
    updatedAt: Date;
    
}

export class ChatRoomListDto {
    @ApiProperty({ type: [ChatRoomDto] })
    list: ChatRoomDto[];
    @ApiProperty({
        example: 10,
        description: `The chat room's total count`,
    })
    total: number;
}