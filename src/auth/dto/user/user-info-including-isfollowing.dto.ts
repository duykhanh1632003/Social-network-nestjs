import { ApiProperty } from "@nestjs/swagger";
import { UserInfoDto } from "./user-info.dto";

export class UserInfoIncludingIsFollowingDto extends UserInfoDto {
    @ApiProperty({
        example: true,
        description: `Whether the current user is following this user or not`
    })
    isFollowing: boolean
}