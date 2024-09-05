import { Injectable } from '@nestjs/common';
import { User } from 'src/db/entity/user.entity';
import { SingleIntegerDto } from 'src/dto/follow/single-integer.dto';
import { UserListDto } from 'src/dto/user/user-list.dto';
import { AuthRepository } from 'src/repo/auth.repository';
import { FollowRepository } from 'src/repo/follow.repository';

@Injectable()
export class FollowService {
 constructor(
     private readonly followRepository: FollowRepository,
     private readonly authRepository: AuthRepository
    ) { }
    
    async createFollow(follower: User, following: string): Promise<SingleIntegerDto> {
        const user = await this.authRepository.findOne({ email: following })
        await this.followRepository.createFollow(follower, user)

        let singleIntegerDto: SingleIntegerDto = new SingleIntegerDto()
        singleIntegerDto.value = await this.followRepository.getFollowerCount(following)
        return singleIntegerDto
    }

    async getIsFollowing(myEmail: string, userEmail: string): Promise<boolean> {
        return this.followRepository.getIsFollowing(myEmail, userEmail)
    }

    async getFollowerCount(email: string): Promise<number> {
        return await this.followRepository.getFollowerCount(email);
    }
    
    async getFollowingCount(email: string): Promise<number> {
        return await this.followRepository.getFollowingCount(email);
    }

    async cancelFollowing(follower: string, following: string): Promise<void> {
        return await this.followRepository.cancelFollowing(follower, following);
    }

    async getFollowerList(email: string,  page: number, limit: number): Promise<UserListDto> {
        return await this.followRepository.getFollowerList(email , page , limit);
    }

    async getFollowingList(email: string,  page: number, limit: number): Promise<UserListDto> {
        return await this.followRepository.getFollowingList(email , page , limit);
    }
    
}
