import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { PrismaService } from '@prisma/prisma.service';
import { PERMISSIONS } from '@common/constant/permissions';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.prismaService.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (userExists)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    const { password, ...rest } = createUserDto;
    const saltRounds = parseInt(
      this.configService.get<string>('BCRYPT_SALT_ROUNDS'),
    );
    const hashedPassword = await hash(password, saltRounds);

    return this.prismaService.user.create({
      data: {
        ...rest,
        account: {
          create: {
            password: hashedPassword,
          },
        },
        permissions: {
          connect: {
            name: PERMISSIONS.USER,
          },
        },
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  async findOne(id: Pick<User, 'id'>['id']): Promise<User> {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: Pick<User, 'id'>['id'],
    updateUserDto: UserDto,
  ): Promise<User> {
    const userExists = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!userExists)
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);

    const userByEmail = await this.prismaService.user.findUnique({
      where: { email: updateUserDto.email },
    });

    if (userByEmail && userByEmail.id !== id) {
      throw new HttpException(
        'Email is already in use',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
      },
    });
  }

  async remove(id: Pick<User, 'id'>['id']): Promise<User> {
    const userExists = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!userExists)
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);

    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
}
