import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../user.service";
import { UserPermissionMiddleware } from "./userPermission.middleware"
import { NextFunction, Request, Response } from "express";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { User } from "../entities/user.entity";

describe('UserPermissionMiddleware', () => {
    let middleware: UserPermissionMiddleware;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserPermissionMiddleware,
                {
                    provide: UserService,
                    useValue: {
                        findOne: jest.fn()
                    }
                }
            ]
        }).compile();

        middleware = module.get<UserPermissionMiddleware>(UserPermissionMiddleware);
        userService = module.get<UserService>(UserService);
    });

    const user: User = {
        id: 'some-uuid',
        fName: 'John',
        lName: 'Doe',
        email: 'johndoe@example.com',
        password: 'hashedPassword',
        phoneNumber: '123456789',
        birtDate: new Date('1990-01-01'),
        profilePictureUrl: 'http://example.com/profile.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
        currency: 'BRL',
        timeZone: 'America/Sao_Paulo',
        language: 'pt-BR',
        role: 'user'
    } as User;

    it('should be defined', () => {
        expect(middleware).toBeDefined()
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
        const req = { params: { id: 'some-uuid' }, user: undefined } as unknown as Request;
        const res = {} as Response;
        const next: NextFunction = jest.fn()

        await expect(middleware.use(req, res, next)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException if user not found', async () => {
        const req = { params: { id: 'some-uuid' }, user: { sub: 'some-uuid', role: 'user' } } as unknown as Request;
        const res = {} as Response;
        const next: NextFunction = jest.fn();

        jest.spyOn(userService, 'findOne').mockResolvedValue(null);

        await expect(middleware.use(req, res, next)).rejects.toThrow(NotFoundException)
    })

    it('should throw UnauthorizedException if user does not have permission', async () => {
        const req = { params: { id: '2' }, user: { sub: '1', role: 'user' } } as unknown as Request;
        const res = {} as Response;
        const next: NextFunction = jest.fn();

        jest.spyOn(userService, 'findOne').mockResolvedValue(user);

        await expect(middleware.use(req, res, next)).rejects.toThrow(UnauthorizedException);
    });

    it('should call next() if user has permission', async () => {
        const req = { params: { id: 'some-uuid' }, user: { sub: 'some-uuid', role: 'user' } } as unknown as Request;
        const res = {} as Response;
        const next: NextFunction = jest.fn();

        jest.spyOn(userService, 'findOne').mockResolvedValue(user);

        await middleware.use(req, res, next);

        expect(next).toHaveBeenCalled();
    });
})