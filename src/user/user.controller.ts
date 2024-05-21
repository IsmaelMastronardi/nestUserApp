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
import { multerOptions } from '../common/multer.config';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('basic'))
  @Get()
  @ApiQuery({ name: 'address', required: true, description: 'User address' })
  @ApiQuery({ name: 'password', required: true, description: 'User password' })
  @ApiResponse({
    status: 200,
    description: 'Will return the number of users, and the detail for each one',
  })
  async getAllUsers() {
    const users = await this.userService.getUsers();
    return users;
  }

  @Post()
  @UseInterceptors(FileInterceptor('profilePicture', multerOptions))
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 200,
    description:
      'Will create a user with the given parameters,the profilePicture paramenter can be absent, otherwise, it must be a file',
  })
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const profilePicture = file ? file.path : undefined;
    return await this.userService.createUser(createUserDto, profilePicture);
  }

  @UseGuards(AuthGuard('basic'))
  @Patch(':id')
  @UseInterceptors(FileInterceptor('profilePicture', multerOptions))
  @ApiParam({ name: 'id', type: 'string' })
  @ApiQuery({ name: 'address', required: true, description: 'User address' })
  @ApiQuery({ name: 'password', required: true, description: 'User password' })
  @ApiResponse({
    status: 200,
    description:
      'Will update the user with the given id, any parameter can be absent',
  })
  async updateUser(
    @Param('id') userId: string,
    @Body('name') userName: string,
    @Body('lastName') userLastName: string,
    @Body('adress') userAdress: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('password') userPassword: string,
  ) {
    const profilePicture = file ? file.path : undefined;
    return await this.userService.updateUser(
      userId,
      userName,
      userLastName,
      userAdress,
      profilePicture,
      userPassword,
    );
  }
}
