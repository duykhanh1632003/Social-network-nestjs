import { Injectable } from '@nestjs/common';
import { UserInfoDto } from 'src/auth/dto/user/user-info.dto';
import { UserRepository } from 'src/repo/user.repository';

@Injectable()
export class UsersService {
    constructor(
        private readonly userRepository: UserRepository
    ) { }   
    
    async getUserInfo(email: string): Promise<UserInfoDto> {
        const userInfo = await this.userRepository.getUserInfo(email);
        return userInfo;
    }
}
