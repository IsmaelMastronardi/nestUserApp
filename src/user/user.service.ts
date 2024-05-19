import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createUser(
    name: string,
    lastName: string,
    address: string,
    profilePicture: string,
    password: string,
  ) {
    const newUser = new this.userModel({
      name,
      lastName,
      address,
      profilePicture,
      password,
    });
    const result = await newUser.save();
    return result.id as string;
  }

  async getUsers() {
    const users = await this.userModel.find().exec();
    return {
      count: users.length,
      products: users.map((user) => ({
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
