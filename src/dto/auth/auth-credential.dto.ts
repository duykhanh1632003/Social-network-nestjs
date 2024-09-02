import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, MaxLength, IsEmail } from "class-validator";
import { AuthSocialType } from "src/enum/auth-social-type-validation.enum";

export class AuthCredentialDto {
    @ApiProperty({
        example: 'Khanh',
        description: `User's name`,
    })
    @IsString()
    username: string

    @ApiProperty({
        example: AuthSocialType.GOOGLE,
        description: `User's social media platform`
    })
    @IsString()
    socialType: string

    @ApiProperty({
        example: 'khanh@gmail.com',
        description: `User's email address`
    })
    @IsEmail()
    email: string

    @ApiProperty({
        example: 'Password123!',
        description: `User's password`
    })
    @IsString()
    @MinLength(8, { message: 'Password is too short (8 characters min)' })
    @MaxLength(20, { message: 'Password is too long (20 characters max)' })
    password: string
}
