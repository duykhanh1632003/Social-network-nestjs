import { ApiProperty } from "@nestjs/swagger";

export class StatusMessageDto {

    @ApiProperty({
        example: 'Khanh',   
        description: 'The new status message',
    })
    statusMessage: string
}