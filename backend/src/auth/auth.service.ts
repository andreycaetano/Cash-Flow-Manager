import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../app/user/entities/user.entity';
import { UserToken } from './interfaces/userToken.interface';
import { UserPayload } from './interfaces/userPayload.interface';
import { UserService } from '../app/user/user.service';
import { MailService } from '../app/mail/mail.service';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly mailService: MailService
    ) { }

    async login(user: User): Promise<UserToken> {
        const payload: UserPayload = {
            sub: user.id,
            email: user.email,
            name: user.fName,
            role: user.role
        };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.userService.findByEmail(email);

        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                return {
                    ...user,
                    password: undefined,
                };
            }
        }

        throw new UnauthorizedException(
            'Email address or password provided is incorrect.',
        );
    }

    async requestPasswordReset(forgotPasswordDto: ForgotPasswordDto) {
        const email = forgotPasswordDto.email;
        const user = await this.userService.findByEmail(email);
        
        const payload = {
            email: email,
            sub: user.id
        }

        const token = this.jwtService.sign(payload, { expiresIn: '2h' });
        
        user.resetPasswordToken = token;

        await this.userService.save(user);

        await this.mailService.sendPasswordResetEmail(email, token);
    }

    async verifyToken (token: string) {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            console.error(`Error verifying token: ${error}`)
            throw new BadRequestException('Error verifying token')
        }
    }
}
