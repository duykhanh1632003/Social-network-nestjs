import { Controller, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/passport/jwt-auth.guard";
import { LoggerService } from './../../logger/logger.service';
import { UsersService } from "./users.service";

@ApiTags('USER')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(
        private readonly logger: LoggerService,
        private readonly userService: UsersService
    ) { }
    
}
