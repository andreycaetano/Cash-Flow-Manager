import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  const createUserDto = {
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

  const hashedPassword = 'hashedpassword123';

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

  const userWithoutPassword = {
    ...user,
    password: undefined,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: () => ({
            save: jest.fn(),
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user and return it without the password', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      repository.create = jest.fn().mockReturnValue(user);
      repository.save = jest.fn().mockResolvedValue(user);

      const result = await service.create(createUserDto);

      expect(result).toEqual(userWithoutPassword);
      expect(repository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
      expect(repository.save).toHaveBeenCalledWith(user);
    });
  });

  describe('save', () => {
    it('should save a user and return it with the password undefined', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(userWithoutPassword);

      const result = await service.save(user);

      expect(result).toEqual(userWithoutPassword);
      expect(repository.save).toHaveBeenCalledWith(user);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return a list of users with the password undefined', async () => {
      const users = [user, { ...user, id: 'another-uuid' } as User];

      jest.spyOn(repository, 'find').mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users.map(u => ({ ...u, password: undefined })));
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return one user with the password undefined', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      const result = await service.findOne('some-uuid');

      expect(result).toEqual(userWithoutPassword);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'some-uuid'}});
      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update and return the new updated user object', async () => {
      const updateUserDto = {
        ...user,
        fName: 'Mike',
        password: undefined
      }

      const updatedUser = {
        ...user,
        ...updateUserDto
      }
      jest.spyOn(repository, 'findOne').mockResolvedValue(user)
      jest.spyOn(repository, 'save').mockResolvedValue(updatedUser);

      const result = await service.update(user.id, updateUserDto)

      expect(result).toEqual({
        ...updatedUser,
        password: undefined
      })
      expect(repository.findOne).toHaveBeenCalledWith({where: {id: user.id}})
      expect(repository.save).toHaveBeenCalledWith(updatedUser);
    })

    it('should hash the password if provided and update the user', async () => {
      const updateUserDto = {
        fName: 'Mike',
        password: 'newPassword123',
      };
    
      const hashedPassword = 'hashedNewPassWord123';
    
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);
    
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
    
      const updatedUser = {
        ...user,
        ...updateUserDto,
        password: hashedPassword,
      };
    
      jest.spyOn(repository, 'save').mockResolvedValue(updatedUser);
    
      const result = await service.update(user.id, updateUserDto);
    
      expect(result).toEqual({
        ...updatedUser,
        password: undefined,
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
    
      expect(repository.save).toHaveBeenCalledWith(updatedUser);
    });
  })

  describe('remove', () => {
    it('should remove user database', async () => {
      const userId = 'some-uuid';
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);
      jest.spyOn(repository, 'remove').mockResolvedValue(undefined);

      await service.remove(userId);
      
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: user.id }});
      expect(repository.remove).toHaveBeenCalledWith(user);
    })
  })

  describe('findByEmail', () => {
    it('should find and return user by email', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      const result = await service.findByEmail(user.email)

      expect(result).toEqual({
        ...user,
        password: undefined
      })
      expect(repository.findOne).toHaveBeenCalledWith({ where: { email: user.email }})
    })
  })
});
