import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from 'src/logger/logger.service';
import { AuthRepository } from './repo/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialDto } from './dto/auth-credential.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthRepository)
        private readonly authRepository: AuthRepository,
        private readonly jwtService: JwtService,
        private readonly logger: LoggerService // Directly inject LoggerService
    ) {
        this.logger.setContext('AuthService'); // Set the context of the logger
    }
    
    async signUp(authCredentialsDto: AuthCredentialDto): Promise<{ accessToken: string }> {
        const { email } = authCredentialsDto;
        const user = await this.authRepository.findOne( { email } );
        
        if (user) {
            this.logger.error(`Sign up Failed. ${email} account already exists in ${user.socialType}.`);
            throw new ConflictException(`Sign up Failed. ${email} account already exists in ${user.socialType}.`);
        }
        
        await this.authRepository.createUser(authCredentialsDto);
        const accessToken = this.jwtService.sign({ email });

        // Return the access token wrapped in an object
        return { accessToken };
    }
}
