import { ApiProperty } from "@nestjs/swagger";
import { MessageType } from "src/enum/message-type";

export class MessageInfoDto {

    @ApiProperty({
        example: 1,
        description: `The ID of the message.`,
    })
    id: number

    @ApiProperty({
        example: "Khanh sky",
        description: "The message's content"
    })
    content: string
    
    @ApiProperty({
        example: MessageType.TEXT,
        description:`The type of the message.`
    })
    type: MessageType


}
