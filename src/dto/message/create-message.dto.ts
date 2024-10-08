import { ApiProperty } from "@nestjs/swagger";
import { MessageType } from "src/enum/message-type";

export class CreateMessageDto {
    
    @ApiProperty({
        example: 2,
        description: `The chat room's ID`
    })
    chatRoomId: string

    @ApiProperty({
        example: 'Khanh sky',
        description: `The message's content`
    })
    content: string
    
    @ApiProperty({
        example: MessageType.TEXT,
        description: `The type of the message.`,
    })
    type: MessageType;
}
