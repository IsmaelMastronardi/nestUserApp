import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body('name') userName: string,
    @Body('lastName') userLastName: string,
    @Body('address') userAddress: string,
    @Body('profilePicture') userProfilePicture: string,
    @Body('password') userPassword: string,
  ) {
    const generatedId = await this.userService.createUser(
      userName,
      userLastName,
      userAddress,
      userProfilePicture,
      userPassword,
    );
    return { id: generatedId };
  }

  @Get()
  async getAllUsers() {
    const users = await this.userService.getUsers();
    return users;
  }
}
