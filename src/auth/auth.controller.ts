import { Body, Controller, Post, UseGuards, ValidationPipe, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from '../dto/auth/auth-credential.dto';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from 'src/decorator/customize';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up a new user.' })
  @ApiResponse({ status: 201, description: 'User successfully signed up.' })
  @Post('/signup')
  @Public()
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialDto
  ): Promise<{ accessToken: string }> {
    return this.authService.signUp(authCredentialsDto);
  }

  @ApiOperation({ summary: 'Sign in an existing user.' })
  @ApiResponse({ status: 200, description: 'User successfully signed in.' })
  @UseGuards(LocalAuthGuard)  
  @Public()    
  @Post('/signin')
  async signIn(@Request() req): Promise<{ accessToken: string }> {
    return this.authService.login(req.user);
  }
}
