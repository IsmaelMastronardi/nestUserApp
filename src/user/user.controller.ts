import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/multer.config';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(FileInterceptor('profilePicture', multerOptions))
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const profilePicture = file ? file.path : undefined;
    return await this.userService.createUser(createUserDto, profilePicture);
  }

  @UseGuards(AuthGuard('basic'))
  @Get()
  async getAllUsers() {
    const users = await this.userService.getUsers();
    return users;
  }

  @UseGuards(AuthGuard('basic'))
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
