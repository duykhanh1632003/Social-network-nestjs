import { User } from "src/db/entity/user.entity";
import { LoggerService } from "src/logger/logger.service";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UserInfoDto } from "src/dto/user/user-info.dto";
import { PostEntity } from "src/db/entity/post.entity";
import { PostStatus } from "src/enum/post-status.enum";
import { Follow } from "src/db/entity/follow.entity";

@Injectable()
export class FollowRepository  {
  constructor(
    @InjectRepository(Follow) private readonly followRepo: Repository<Follow>, 
    private readonly logger: LoggerService
  ) {
    this.logger.setContext('FollowRepository');
  }
 
  
}
