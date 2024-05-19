import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
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

  @Patch(':id')
  async updateUser(
    @Param('id') userId: string,
    @Body('name') userName: string,
    @Body('lastName') userLastName: string,
    @Body('adress') userAdress: string,
    @Body('profilePicture') userProfilePicture: string,
    @Body('password') userPassword: string,
  ) {
    await this.userService.updateUser(
      userId,
      userName,
      userLastName,
      userAdress,
      userProfilePicture,
      userPassword,
    );
    return null;
  }
}
