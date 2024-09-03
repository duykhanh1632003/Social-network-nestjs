import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentEntity } from "src/db/entity/comment.entity";
import { LoggerService } from "src/logger/logger.service";
import { Repository } from "typeorm";

@Injectable()
export class CommentRepository {
    constructor(
    @InjectRepository(CommentEntity) private readonly followRepo: Repository<CommentEntity>, 
    private readonly logger: LoggerService
  ) {
    this.logger.setContext('FollowRepository');
  }

  async 
}