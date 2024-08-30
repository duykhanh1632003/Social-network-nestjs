import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthRepository } from "src/auth/repo/auth.repository";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from "src/interfaces/jwt.interface";
import { User } from "src/db/entity/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    private configService: ConfigService, // Inject ConfigService
  ) {
    super({
      secretOrKey: configService.get<string>('jwtSecret'), // Get JWT_SECRET from configuration
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { email } = payload;
    const user: User = await this.authRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user; // Attach the user to the request object
  }
}