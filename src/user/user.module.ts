import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot()],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
