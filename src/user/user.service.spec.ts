import { InternalServerErrorException } from '@nestjs/common';
import { UserService } from './user.service';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
describe('UserService', () => {
  let userService: UserService;
  let mockUserModel: Model<any>;

  beforeEach(() => {
    mockUserModel = jest.fn() as any;
    userService = new UserService(mockUserModel);
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        name: 'Juan',
        lastName: 'Perez',
        password: 'password',
        address: 'test@example.com',
      };
      const profilePicture = 'profile.jpg';

      mockUserModel.prototype.save = jest.fn().mockResolvedValue({ id: '1' });

      const result = await userService.createUser(
        createUserDto,
        profilePicture,
      );

      expect(result).toEqual({ message: 'user created', id: '1' });
    });
    it('should create a new user with no ', async () => {
      const createUserDto = {
        name: 'Juan',
        lastName: 'Perez',
        password: 'password',
        address: 'test@example.com',
      };

      mockUserModel.prototype.save = jest.fn().mockResolvedValue({ id: '1' });

      const result = await userService.createUser(createUserDto, undefined);

      expect(result).toEqual({ message: 'user created', id: '1' });
    });
    it('should throw InternalServerErrorException on missing required filed', async () => {
      const createUserDto = {
        name: undefined,
        lastName: 'Juan',
        password: 'password',
        address: 'test@example.com',
      };
      const profilePicture = 'profile.jpg';

      await expect(
        userService.createUser(createUserDto, profilePicture),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('updateuser', () => {
    it('should update an user', async () => {
      const userId = '1';
      const existingUser = {
        name: 'old name',
        lastName: 'old lastName',
        password: 'old password',
        address: 'old@old.com',
        profilePicture: 'old.jpg',
        save: jest.fn().mockResolvedValue({ id: userId }),
      };
      const updateUser = {
        name: 'new name',
        lastName: 'new lastName',
        password: 'new password',
        address: 'new@new.com',
        save: jest.fn().mockResolvedValue({ id: userId }),
      };
      const newPic = 'profile.jpg';
      const hashedPassword = 'hashedPassword';

      mockUserModel.findById = jest.fn().mockResolvedValue(existingUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      const result = await userService.updateUser(
        userId,
        updateUser.name,
        updateUser.lastName,
        updateUser.address,
        newPic,
        updateUser.password,
      );

      expect(result).toEqual({ message: 'user updated' });
      expect(existingUser.name).toBe(updateUser.name);
      expect(existingUser.lastName).toBe(updateUser.lastName);
      expect(existingUser.address).toBe(updateUser.address);
      expect(existingUser.password).toBe(hashedPassword);
      expect(existingUser.profilePicture).toBe(newPic);
    });
    it('should update only the name of the user ', async () => {
      const userId = '1';
      const existingUser = {
        name: 'old name',
        lastName: 'old lastName',
        password: 'old password',
        address: 'old@old.com',
        profilePicture: 'old.jpg',
        save: jest.fn().mockResolvedValue({ id: userId }),
      };
      const updateUser = {
        name: 'new name',
        save: jest.fn().mockResolvedValue({ id: userId }),
      };
      const hashedPassword = 'hashedPassword';

      mockUserModel.findById = jest.fn().mockResolvedValue(existingUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      const result = await userService.updateUser(
        userId,
        updateUser.name,
        undefined,
        undefined,
        undefined,
        undefined,
      );
      expect(result).toEqual({ message: 'user updated' });
      expect(existingUser.name).toBe(updateUser.name);
      expect(existingUser.lastName).toBe(existingUser.lastName);
      expect(existingUser.address).toBe(existingUser.address);
      expect(existingUser.password).toBe(existingUser.password);
      expect(existingUser.profilePicture).toBe(existingUser.profilePicture);
    });
  });

  describe('getAllUsers', () => {
    it('should create a new user', async () => {
      const users = [
        {
          id: 1,
          name: 'Juan',
          lastName: 'Perez',
          address: 'juan@gmail.com',
          profilePicture: 'profile.jpg',
        },
        {
          id: 2,
          name: 'Julieta',
          lastName: 'Perez',
          address: 'julieta@gmail.com',
          profilePicture: 'profile.jpg',
        },
      ];

      mockUserModel.find = jest.fn().mockResolvedValue(users);

      const result = await userService.getUsers();

      expect(result).toEqual({ count: 2, users: users });
    });
  });
});
