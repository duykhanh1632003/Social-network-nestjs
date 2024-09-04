import { User } from "src/db/entity/user.entity";
import { LoggerService } from "src/logger/logger.service";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Follow } from "src/db/entity/follow.entity";
import { UserListDto } from "src/dto/user/user-list.dto";
import { UserSimpleInfoIncludingStatusMessageDto } from "src/dto/user/user-simple-info-including-status-message.dto";

@Injectable()
export class FollowRepository  {
  constructor(
    @InjectRepository(Follow) private readonly followRepo: Repository<Follow>, 
    private readonly logger: LoggerService
  ) {
    this.logger.setContext('FollowRepository');
  }
 
  async createFollow(follower: User, following: User): Promise<void> {
    try {
      const follow = this.followRepo.create({ follower, following });
      await this.followRepo.save(follow);
    } catch (error) {
      this.logger.error(`Failed to create follow relationship: ${error.message}`, error.stack);
      throw new Error('Failed to create follow relationship');
    }
  }

  async getIsFollowing(myEmail: string, userEmail: string): Promise<boolean> {
    const result = await this.followRepo
      .createQueryBuilder('follow')
      .select('COUNT(*)', 'count')
      .leftJoin('follow.following', 'following')
      .leftJoin('follow.follower', 'user')
      .where('following.email = :userEmail', { userEmail })
      .andWhere('user.email = :myEmail', { myEmail })
      .getRawOne();
    
    return result.count > 0;
  }
 
  async getFollowerCount(email: string): Promise<number> {
    return this.followRepo
        .createQueryBuilder('follow')
        .leftJoinAndSelect('follow.following', 'following')
        .where('following.email = :email', { email })
        .getCount();
    }

    async getFollowingCount(email: string): Promise<number> {
      return this.followRepo
        .createQueryBuilder('follow')
        .leftJoinAndSelect('follow.follower', 'follower')
        .where('follower.email = :email', { email })
        .getCount();
  }

  async getFollowerList(email: string, page: number, limit: number): Promise<UserListDto> {
    
    const query = this.followRepo.createQueryBuilder('follow').leftJoinAndSelect('follow.following', 'following').leftJoinAndSelect('follow.follower', 'user').where('following.email = :email', { email }).skip((page - 1) * limit).take(limit)

    const [follows, total] = await query.getManyAndCount()

    const userList: UserSimpleInfoIncludingStatusMessageDto[] = follows.map((follow: Follow) => {
            const userInfo: UserSimpleInfoIncludingStatusMessageDto = new UserSimpleInfoIncludingStatusMessageDto();
            userInfo.email = follow.follower.email;
            userInfo.username = follow.follower.username;
            userInfo.thumbnail = follow.follower.thumbnail;
            userInfo.statusMessage = follow.follower.statusMessage;
            return userInfo;
        });

        return { userList, total };
    
  }
} 
