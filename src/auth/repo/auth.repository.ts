import { User } from "src/db/entity/user.entity";
import { LoggerService } from "src/logger/logger.service";
import { DataSource, Repository } from "typeorm";
import { AuthCredentialDto } from "../dto/auth-credential.dto";
import * as moment from 'moment-timezone';
import { v4 as uuidv4 } from 'uuid';
import { ConflictException, InternalServerErrorException } from "@nestjs/common";

export class AuthRepository  extends Repository<User>{
    constructor(
        private readonly dataSource: DataSource,
        private readonly logger: LoggerService // Directly inject LoggerService
    ) {
        super(User, dataSource.createEntityManager());
        this.logger.setContext('AuthRepository'); 
    }

    async createUser(authCredentialsDto: AuthCredentialDto): Promise<void> {
        const { username, socialType, email } = authCredentialsDto;
        const createdAt = moment().tz('Asia/VietNam').format('YYYY-MM-DD HH:mm:ss.SSS');
        const uuid = uuidv4();
        
        const user = this.create({
            uuid,
            username,
            socialType,
            email,
            createdAt,
            bookMarks: [],
        });
        try {
            await this.save(user);
            this.logger.verbose(`User ${user.email} account has been created`);
        } catch (error) {
            if (error.code === '23505') { // Duplicate error code from Postgres
                throw new ConflictException(`Sign up Failed. ${email} account already exists.`);
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

}   