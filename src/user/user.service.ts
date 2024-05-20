import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createUser(
    createUserDto: CreateUserDto,
    profilePicture: string,
  ): Promise<object> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = new this.userModel({
        ...createUserDto,
        profilePicture,
        password: hashedPassword,
      });

      const result = await newUser.save();

      return {
        message: 'user created',
        id: result.id,
      };
    } catch (error) {
      throw new InternalServerErrorException('Could not create user');
    }
  }

  async getUsers() {
    try {
      const users = await this.userModel.find();
      return {
        count: users.length,
        users: users.map((user) => ({
          id: user.id,
          name: user.name,
          lastName: user.lastName,
          address: user.address,
          profilePicture: user.profilePicture,
        })),
      };
    } catch (error) {
      throw new InternalServerErrorException('Could not get users');
    }
  }

  async updateUser(
    id: string,
    name: string,
    lastName: string,
    adress: string,
    profilePicture: string,
    password: string,
  ) {
    try {
      const updateUser = await this.findUser(id);
      if (name) {
        updateUser.name = name;
      }
      if (lastName) {
        updateUser.lastName = lastName;
      }
      if (adress) {
        updateUser.address = adress;
      }
      if (profilePicture) {
        updateUser.profilePicture = profilePicture;
      }
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateUser.password = hashedPassword;
      }
      updateUser.save();
      return {
        message: 'user updated',
      };
    } catch (error) {
      throw new InternalServerErrorException('Could not update user');
    }
  }

  async findByAddress(address: string): Promise<User | null> {
    return await this.userModel.findOne({ address: address });
  }

  private async findUser(id: string): Promise<User> {
    let user;
    try {
      user = await this.userModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Could not find user');
    }
    if (!user) {
      throw new NotFoundException('Could not find user');
    }
    return user;
  }
}
