import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/app/user/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from '../app/user/user.service';
import { MailService } from '../app/mail/mail.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn()
}));

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn()
          }
        },
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn()
          }
        },
        {
          provide: MailService,
          useValue: { 
            sendPasswordResetEmail: jest.fn()
          }
        }
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('login', () => {
    it('should return a valid JWT token', async () => {
      const user: User = {
        id: 'some-uuid',
        fName: 'John',
        lName: 'Doe',
        email: 'johndoe@example.com',
        password: 'hashedpassword123',
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

      const token = 'some-jwt-token';
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await authService.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        name: user.fName,
        role: user.role
      });

      expect(result).toEqual({ access_token: token });
    });
  });

  describe('validateUser', () => {
    it('should return the user object without password if validation is successful', async () => {
      const user: User = {
        id: 'some-uuid',
        fName: 'John',
        lName: 'Doe',
        email: 'johndoe@example.com',
        password: 'hashedpassword123',
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

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser(user.email, 'hashedpassword123');

      expect(userService.findByEmail).toHaveBeenCalledWith(user.email);
      expect(bcrypt.compare).toHaveBeenCalledWith('hashedpassword123', user.password);

      expect(result).toEqual({
        ...user,
        password: undefined
      })
    })

    it('should throw UnauthorizedException if user is not found', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

      await expect(
        authService.validateUser('wrong@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);

      expect(userService.findByEmail).toHaveBeenCalledWith('wrong@example.com');
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        fName: 'John',
        password: 'password123',
      } as any;

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.validateUser(user.email, 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);

      expect(userService.findByEmail).toHaveBeenCalledWith(user.email);
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', user.password);
    });
  })
});
