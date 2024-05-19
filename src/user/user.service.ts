import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createUser(
    name: string,
    lastName: string,
    adress: string,
    profilePicture: string,
    password: string,
  ) {
    const newUser = new this.userModel({
      name,
      lastName,
      adress,
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
        adress: user.adress,
        profilePicture: user.profilePicture,
      })),
    };
  }
}
