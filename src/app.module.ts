import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user/user.model';
import { UserService } from './user/user.service';
import { BasicAuthStrategy } from './basic.strategy';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, UserService, BasicAuthStrategy],
})
export class AppModule {}
