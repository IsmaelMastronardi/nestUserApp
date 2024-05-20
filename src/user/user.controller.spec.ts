import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUsers = [
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
      address: 'jualieta@gmail.com',
      profilePicture: 'profile.jpg',
    },
  ];

  const mockUserService = {
    getUsers: jest.fn(() => Promise.resolve(mockUsers)),
    createUser: jest.fn(),
    updateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const result = await userController.getAllUsers();
      expect(result).toEqual(mockUsers);
      expect(userService.getUsers).toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto = {
        name: 'Juan',
        lastName: 'Perez',
        address: 'juan@gmail.com',
        password: 'password',
      };
      const profilePicture = {
        fieldname: 'profilePicture',
        originalname: 'profile.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 12345,
        destination: '/path/to/destination',
        filename: 'profile.jpg',
        path: '/path/to/profile.jpg',
        buffer: Buffer.from('profile.jpg'),
        stream: null,
      };

      await userController.createUser(createUserDto, profilePicture);
      expect(mockUserService.createUser).toHaveBeenCalledWith(
        createUserDto,
        profilePicture.path,
      );
    });
  });
  describe('updateUser', () => {
    it('should update a user with the new params', async () => {
      const id = '1';
      const updateuser = {
        name: 'new name',
        lastName: 'new lastname',
        address: 'new address',
        password: 'new password',
      };
      const newProfilePicture = {
        fieldname: 'profilePicture',
        originalname: 'profile.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 12345,
        destination: '/path/to/destination',
        filename: 'new-profile.jpg',
        path: '/path/to/profile.jpg',
        buffer: Buffer.from('profile.jpg'),
        stream: null,
      };

      await userController.updateUser(
        id,
        updateuser.name,
        updateuser.lastName,
        updateuser.address,
        newProfilePicture,
        updateuser.password,
      );
      expect(mockUserService.updateUser).toHaveBeenCalledWith(
        id,
        updateuser.name,
        updateuser.lastName,
        updateuser.address,
        newProfilePicture.path,
        updateuser.password,
      );
    });
  });
});
