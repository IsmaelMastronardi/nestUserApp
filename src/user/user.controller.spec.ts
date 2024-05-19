import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserModule } from './user.module';
import { getModelToken } from '@nestjs/mongoose';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(getModelToken('User'))
      .useValue(jest.fn())
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
