import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async save (user: User): Promise<User> {
    const saveUser = await this.userRepository.save(user);
    return {
      ...saveUser,
      password: undefined
    };
  };

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createUser = this.userRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10)
    })
    return await this.save(createUser);
  }

  async findAll(): Promise<User[]> {
    const findUsers = await this.userRepository.find();
    return findUsers.map((user: User) => {
      return {
        ...user,
        password: undefined
      }
    });
  }

  async findOne(id: string): Promise<User> {
    const findUser = await this.userRepository.findOne({
      where: {
        id
      }
    })

    if(!findUser) throw new  NotFoundException('User not found')

    return {
      ...findUser,
      password: undefined
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const findUser = await this.findOne((id));

    if(updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10)
    }
    Object.assign(findUser, updateUserDto)
    return await this.save(findUser)
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id }})
    if(!user) throw new NotFoundException('User not found')
    await this.userRepository.remove(user);
  }

  async findByEmail (email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email }})
    if(!user) throw new NotFoundException('User not found')
    return {
      ...user,
      password: undefined
    }
  }
}
