import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

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

  const userWithoutPassword = { ...user, password: undefined };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn().mockResolvedValue(userWithoutPassword),
            findAll: jest.fn().mockResolvedValue([userWithoutPassword]),
            findOne: jest.fn().mockResolvedValue(userWithoutPassword),
            update: jest.fn().mockResolvedValue(userWithoutPassword),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        fName: 'John',
        lName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        phoneNumber: '123456789',
        birtDate: new Date('1990-01-01'),
        profilePictureUrl: 'http://example.com/profile.jpg',
        currency: 'BRL',
        timeZone: 'America/Sao_Paulo',
        language: 'pt-BR',
        role: 'user'
      };

      const result = await controller.create(createUserDto);

      expect(result).toEqual(userWithoutPassword);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await controller.findAll();

      expect(result).toEqual([userWithoutPassword]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one user by ID', async () => {
      const result = await controller.findOne('some-uuid');

      expect(result).toEqual(userWithoutPassword);
      expect(service.findOne).toHaveBeenCalledWith('some-uuid');
    });
  });

  describe('update', () => {
    it('should update a user by ID', async () => {
      const updateUserDto: UpdateUserDto = {
        fName: 'Mike',
        password: 'newPassword123',
      };

      const result = await controller.update('some-uuid', updateUserDto);

      expect(result).toEqual(userWithoutPassword);
      expect(service.update).toHaveBeenCalledWith('some-uuid', updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user by ID', async () => {
      const result = await controller.remove('some-uuid');

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith('some-uuid');
    });
  });
});
