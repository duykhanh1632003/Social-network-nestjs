import { User } from "src/db/entity/user.entity";
import { LoggerService } from "src/logger/logger.service";
import { Repository } from "typeorm";
import { AuthCredentialDto } from "../auth/dto/auth-credential.dto";
import * as moment from 'moment-timezone';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>, 
    private readonly logger: LoggerService
  ) {
    this.logger.setContext('UserRepository');
  }

  
}
