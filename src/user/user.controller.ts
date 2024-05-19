import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body('name') userName: string,
    @Body('lastName') userLastName: string,
    @Body('adress') userAdress: string,
    @Body('profilePicture') userProfilePicture: string,
    @Body('password') userPassword: string,
  ) {
    const generatedId = await this.userService.createUser(
      userName,
      userLastName,
      userAdress,
      userProfilePicture,
      userPassword,
    );
    return { id: generatedId };
  }
}
