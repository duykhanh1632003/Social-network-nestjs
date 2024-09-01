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
    this.logger.setContext('AuthRepository');
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async createUser(authCredentialsDto: AuthCredentialDto): Promise<void> {
    const { username, socialType, email, password } = authCredentialsDto;
    const createdAt = moment().tz('Asia/VietNam').format('YYYY-MM-DD HH:mm:ss.SSS');
    const uuid = uuidv4();

    const hashedPassword = await this.hashPassword(password); // Hash password

    const user = this.userRepository.create({
      uuid,
      username,
      socialType,
      email,
      password: hashedPassword, // Save hashed password
      createdAt,
      bookMarks: [],
    });

    try {
      await this.userRepository.save(user);
      this.logger.verbose(`User ${user.email} account has been created`);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`Sign up Failed. ${email} account already exists.`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findOne({ email }: { email: string }): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }
}
