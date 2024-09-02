import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/passport/jwt-auth.guard";
import { LoggerService } from './../../logger/logger.service';
import { UsersService } from "./users.service";
import { UserInfoDto } from "src/auth/dto/user/user-info.dto";
import { GetUser } from "src/auth/decorator/get-user.decorator";
import { User } from "src/db/entity/user.entity";

@ApiTags('USER')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(
        private readonly logger: LoggerService,
        private readonly userService: UsersService
    ) { }
    
    @ApiResponse({
        type: UserInfoDto,
        status: 200,
        description: 'Success',
    })
    @ApiOperation({ summary: `Get my information` })
    @Get('/')
    getMyInfo(
        @GetUser() user: User,
    ): Promise<UserInfoDto> {
        this.logger.verbose(`User ${user.email} trying to get own information.`);
        return this.userService.getUserInfo(user.email);
    }
    
    

}
