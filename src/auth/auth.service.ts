import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { AuthRepository } from '../repo/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialDto } from './dto/auth-credential.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('AuthService');
  }

  async signUp(authCredentialsDto: AuthCredentialDto): Promise<{ accessToken: string }> {
    const { email } = authCredentialsDto;
    const user = await this.authRepository.findOne({ email });

    if (user) {
      this.logger.error(`Sign up Failed. ${email} account already exists.`);
      throw new ConflictException(`Sign up Failed. ${email} account already exists.`);
    }

      await this.authRepository.createUser(authCredentialsDto);
      
    const accessToken = this.jwtService.sign({ email });

    return { accessToken };
  }


  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.authRepository.findOne({ email: email });
    if (user && (await this.authRepository.validatePassword(pass, user.password))) {
      const { password, ...result } = user;
      return result;
      }
    else {
        this.logger.error(`Sign in Failed. Invalid credentials for ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }
    
  }

  async login(user: any): Promise<{ accessToken: string }> {
    const payload = { uuid: user.uuid,  email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
