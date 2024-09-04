import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRequest } from './interfaces/authRequest.interface';
import { UserService } from '../app/user/user.service';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            validateUser: jest.fn(),
            requestPasswordReset: jest.fn(),
            verifyToken: jest.fn()
          }
        },
        {
          provide: UserService,
          useValue: {
            update: jest.fn()
          }
        }
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return a valid token', async () => {
      const mockUser = { id: 1, username: 'testuser' };
      const mockRequest: AuthRequest = { user: mockUser } as unknown as AuthRequest;
      const result = { access_token: 'mock_token' };

      jest.spyOn(authService, 'login').mockResolvedValueOnce(result);

      expect(await authController.login(mockRequest)).toBe(result);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('forgot-password', () => {
    it('should call AuthService.requestPasswordReset with correct parameters', async () => {
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'example@mail.com'
      };

      await authController.forgotPassword(forgotPasswordDto);

      expect(authService.requestPasswordReset).toHaveBeenCalledWith(forgotPasswordDto);
    })

    it('Should return success message after requesting password reset', async () => {
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'example@mail.com'
      };

      const response = await authController.forgotPassword(forgotPasswordDto);

      expect(response).toEqual({
        message: 'If your email is registered, you will receive a link to reset your password.'
      });
    })
  })
});
