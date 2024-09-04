import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto{
    @ApiProperty({
      example: 'John'
    })
    @IsString()
    fName: string;

    @ApiProperty({
      example: 'Doe'
    })
    @IsString()
    lName: string;

    @ApiProperty({
      example: 'johndoe@example.com'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
      example: 'password123@',
      minimum: 6,
      maximum: 20,
    })
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: 'password too weak',
    })
    password: string;
    
    @ApiProperty({
      example: '12345678910',
      minimum: 11,
      maximum: 11
    })
    @IsString()
    phoneNumber: string;

    @ApiProperty({
      example: '01/01/2021'
    })
    @IsDate()
    birtDate: Date;

    @ApiProperty({
      example: 'https://img.com/example.jpg'
    })
    @IsOptional()
    @IsString()
    profilePictureUrl: string;

    @ApiPropertyOptional({
      example: 'BRL'
    })
    @IsOptional()
    @IsString()
    currency: string

    @ApiPropertyOptional({
      example: 'pt-BR'
    })
    @IsOptional()
    @IsString()
    language: string;

    @ApiPropertyOptional({
      example: 'America/Sao_Paulo'
    })
    @IsOptional()
    @IsString()
    timeZone: string;

    @ApiPropertyOptional({
      example: 'user'
    })
    @IsOptional()
    @IsString()
    role: string
}
