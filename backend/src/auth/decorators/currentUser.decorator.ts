import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/app/user/entities/user.entity';
import { AuthRequest } from '../interfaces/authRequest.interface';

export const CurrentUser = createParamDecorator(
    (data: unknown, context: ExecutionContext): User => {
        const request = context.switchToHttp().getRequest<AuthRequest>();

        return request.user;
    },
);
