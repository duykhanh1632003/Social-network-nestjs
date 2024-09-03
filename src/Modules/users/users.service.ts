import { Injectable } from '@nestjs/common';
import { UserInfoIncludingIsFollowingDto } from 'src/dto/user/user-info-including-isfollowing.dto';
import { UserInfoDto } from 'src/dto/user/user-info.dto';
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
}
