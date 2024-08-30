import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { AuthSocialType } from "src/enum/auth-social-type-validation.enum";

export class AuthSocialTypeValidationType implements PipeTransform {
    readonly AuthSocialTypeOptions = [
        AuthSocialType.GOOGLE
    ]

    transform(value: any, metadata: ArgumentMetadata) {
        if (!value) {
            throw new BadRequestException('Invalid socialType')
        }
        if (typeof value === 'string') {
            value = value.toUpperCase()

            if (!this.isAuthSocialTypeValid(value)) {
                throw new BadRequestException(`${value} isn't in the social type options`);
            }
        }
        else {
            throw new BadRequestException('Invalid socialType');
        }
        
        return value
    }

    private isAuthSocialTypeValid(socialType: any) {
        return this.AuthSocialTypeOptions.includes(socialType);
    }
}