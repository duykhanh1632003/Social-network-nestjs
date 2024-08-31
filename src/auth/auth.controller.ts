import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    
    @ApiOperation({ summary: 'Sign up the user based on existence.' })
    @ApiResponse({ status: 201, description: 'Success' })
    @Post('/signup')
    signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialDto): Promise<{accessToken: string}> {
        return this.authService.signUp(authCredentialsDto);
    }

    @ApiOperation({ summary: 'Sign in the user' })
    @ApiResponse({ status: 200, description: 'Success' })
    @Post('/signin')
    signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialDto): Promise<{accessToken: string}> {
        return this.authService.signIn(authCredentialsDto);
    }
}
