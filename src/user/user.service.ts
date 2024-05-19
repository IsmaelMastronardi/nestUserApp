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
}
