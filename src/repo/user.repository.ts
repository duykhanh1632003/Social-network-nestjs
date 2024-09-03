import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/db/entity/user.entity";
import { LoggerService } from "src/logger/logger.service";
import { UserInfoDto } from "src/dto/user/user-info.dto";
import { PostEntity } from "src/db/entity/post.entity";
import { PostStatus } from "src/enum/post-status.enum";
import { BookMarksDto } from "src/dto/user/book-marks.dto";

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('UserRepository');
  }

  async getUserInfo(email: string): Promise<UserInfoDto> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .leftJoin('user.followings', 'follow')
      .loadRelationCountAndMap('user.followerCount', 'user.followers')
      .loadRelationCountAndMap('user.followingCount', 'user.followings')
      .select([
        'user.email',
        'user.username',
        'user.thumbnail',
        'user.bookMarks',
        'user.statusMessage',
        'COUNT(follow.id) as followerCount',
        'COUNT(follow.id) as followingCount',
      ])
      .groupBy('user.email')
      .getOne();

    const post = this.userRepo
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .leftJoinAndSelect('user.posts', 'post', 'post.status =:status', {
        status: PostStatus.PUBLIC,
      })
      .select('COUNT(post.id)', 'totalPostCount');

    const [{ totalPostCount }] = await post.getRawMany();

    if (user) {
      let userInfo: UserInfoDto = new UserInfoDto();
      userInfo.email = user.email;
      userInfo.username = user.username;
      userInfo.thumbnail = user.thumbnail;
      userInfo.bookMarks = user.bookMarks;
      userInfo.statusMessage = user.statusMessage;
      userInfo.totalPostCount = isNaN(parseInt(totalPostCount, 10))
        ? 0
        : parseInt(totalPostCount, 10);
      userInfo.followerCount = user.followerCount;
      userInfo.followingCount = user.followingCount;
      return userInfo;
    } else {
      throw new NotFoundException(`User not found`);
    }
  }

  async postBookMark(email: string, postId: number): Promise<BookMarksDto> {
    const user = await this.userRepo.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    let { bookMarks } = user;

    // If it was previously bookmarked, cancel the bookmark
    if (bookMarks.includes(postId)) {
      bookMarks = bookMarks.filter((id) => id !== postId);
    }
    // If it hadn't been bookmarked yet, proceed with bookmarking
    else {
      bookMarks.push(postId);
    }
    user.bookMarks = bookMarks;
    await this.userRepo.save(user);

    return { bookMarks };
  }
}
