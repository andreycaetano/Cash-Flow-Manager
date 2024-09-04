import { Injectable, NestMiddleware, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UserService } from "../user.service";
import { AuthRequest } from "src/auth/interfaces/authRequest.interface";
import { UserPayload } from "src/auth/interfaces/userPayload.interface";

@Injectable()
export class UserPermissionMiddleware implements NestMiddleware {
    constructor(
        private readonly userService: UserService
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.id;
        const currentUser = req.user as UserPayload;

        if (!currentUser) throw new UnauthorizedException('Unauthenticated user');

        const user = await this.userService.findOne(userId);

        if (!user) throw new NotFoundException('User not found');

        if(currentUser.sub !== user.id && currentUser.role !== 'admin') {
            throw new UnauthorizedException('Access denied');
        };

        next()
    }
}