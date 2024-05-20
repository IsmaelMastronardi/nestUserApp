import { Injectable, NotFoundException } from '@nestjs/common';
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
  ): Promise<string> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel({
      ...createUserDto,
      profilePicture,
      password: hashedPassword,
    });
    const result = await newUser.save();
    return result.id as string;
  }

  async getUsers() {
    const users = await this.userModel.find().exec();
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
  }

  async updateUser(
    id: string,
    name: string,
    lastName: string,
    adress: string,
    profilePicture: string,
    password: string,
  ) {
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
      updateUser.password = password;
    }
    updateUser.save();
  }

  async findByAddress(address: string): Promise<User | null> {
    console.log(await this.userModel.findOne({ address: address }));
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
