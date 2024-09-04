import { Injectable } from '@nestjs/common';
import { User } from 'src/db/entity/user.entity';
import { UpdatedUserThumbnailDto } from 'src/dto/user/updated-user-thumbnail.dto';
import { UserInfoIncludingIsFollowingDto } from 'src/dto/user/user-info-including-isfollowing.dto';
import { UserInfoDto } from 'src/dto/user/user-info.dto';
import { UserListDto } from 'src/dto/user/user-list.dto';
import { FollowRepository } from 'src/repo/follow.repository';
import { PostRepository } from 'src/repo/post.repository';
import { UserRepository } from 'src/repo/user.repository';

@Injectable()
export class UsersService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly followRepository: FollowRepository,
        private readonly postRepository: PostRepository

    ) { }   
    
    async getUserInfo(email: string): Promise<UserInfoDto> {
        const userInfo = await this.userRepository.getUserInfo(email);
        return userInfo;
    }

    async getUserInfoByEmail(myEmail: string, userEmail: string): Promise<UserInfoIncludingIsFollowingDto> {
        const userInfoIncludingIsFollowing = new UserInfoIncludingIsFollowingDto()

        const userInfo = await this.userRepository.getUserInfo(userEmail)
        userInfoIncludingIsFollowing.email = userInfo.email
        userInfoIncludingIsFollowing.username = userInfo.username
        userInfoIncludingIsFollowing.thumbnail = userInfo.thumbnail
        userInfoIncludingIsFollowing.bookMarks = userInfo.bookMarks
        userInfoIncludingIsFollowing.statusMessage = userInfo.statusMessage
        userInfoIncludingIsFollowing.totalPostCount = userInfo.totalPostCount
        userInfoIncludingIsFollowing.followerCount = userInfo.followerCount
        userInfoIncludingIsFollowing.followingCount = userInfo.followingCount

        const isFollowing = await this.followRepository.getIsFollowing(myEmail, userEmail)

        userInfoIncludingIsFollowing.isFollowing = isFollowing;

        return userInfoIncludingIsFollowing;

    }

    async postBookMark(email: string, postId: number): Promise<void> {
        const bookMarks = await this.userRepository.postBookMark(email, postId)
        if (bookMarks) {
            await this.postRepository.postBookMark(email, postId);
        }
    }

    async updateUserThumbnail(email: string, newThumbnailUrl): Promise<UpdatedUserThumbnailDto> {
        return await this.userRepository.updateUserThumbnail(email, newThumbnailUrl)
    }

    async deleteThumbnail(user: User): Promise<UpdatedUserThumbnailDto> {
        return this.userRepository.deleteThumbnail(user)
    }

    async updateStatusMessage(email: string, statusMessageDto: string): Promise<void> {
        return await this.userRepository.updateStatusMessage(email, statusMessageDto)
    }

    async getUserListByKeyWord(user: User, keyword: string, page: number, limit: number): Promise <UserListDto>{
        return await this.userRepository.getUserListByKeyWord(user, keyword,page,limit)
    }
}
