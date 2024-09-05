import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../app/user/user.service';
import { AuthService } from './auth.service';
import { IsPublic } from './decorators/isPublic.decorator';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { LocalAuthGuard } from './guards/localAuth.guard';
import { AuthRequest } from './interfaces/authRequest.interface';
import { LoginRequestBody } from './models/loginRequestBody.model';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) { }

    @ApiBody({
        type: LoginRequestBody
    })
    @ApiResponse({
        status: 200,
        schema: {
            example: {
                access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
            }
        }
    })
    @IsPublic()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Request() req: AuthRequest) {
        return this.authService.login(req.user);
    }

    @ApiBody({
        type: ForgotPasswordDto
    })
    @ApiResponse({
        status: 200,
        schema: {
            example: {
                message: 'If your email is registered, you will receive a link to reset your password.'
            }
        }
    })
    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Request() forgotPasswordDto: ForgotPasswordDto) {
        await this.authService.requestPasswordReset(forgotPasswordDto);
        return { message: 'If your email is registered, you will receive a link to reset your password.' };
    }

    @ApiBody({
        type: ResetPasswordDto
    })
    @Post('reset-password')
    async resetPassword(@Request() resetPasswordDto: ResetPasswordDto) {
        const decoded = await this.authService.verifyToken(resetPasswordDto.token);
        return await this.userService.update(decoded.sub, { password: resetPasswordDto.newPassword })
    }

    @IsPublic()
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Request() req) {

    }

    
    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Request() req) {
        
        return {
            message: 'Usuario autenticado com sucesso!',
            user: req.user
        }
    }
}
