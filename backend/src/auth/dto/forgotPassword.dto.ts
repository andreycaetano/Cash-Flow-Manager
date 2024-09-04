import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ForgotPasswordDto {
    @ApiProperty({
        example: 'example@mail.com'
    })
    @IsEmail()
    email: string;
}