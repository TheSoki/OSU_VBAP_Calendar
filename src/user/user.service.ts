import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UserDto } from 'src/common/dto/user.dto';
import { hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: UserDto): Promise<User> {
    const userExists = await this.prismaService.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const { password, ...rest } = createUserDto;
    const saltRounds = parseInt(
      this.configService.get<string>('BCRYPT_SALT_ROUNDS'),
    );
    const hashedPassword = await hash(password, saltRounds);

    return this.prismaService.user.create({
      data: {
        ...rest,
        password: hashedPassword,
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
      where: { email: updateUserDto.email },
    });
    if (!userExists) {
      throw new BadRequestException('User does not exist');
    }

    const { password, ...rest } = updateUserDto;
    const saltRounds = parseInt(
      this.configService.get<string>('BCRYPT_SALT_ROUNDS'),
    );
    const hashedPassword = await hash(password, saltRounds);

    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...rest,
        password: hashedPassword,
      },
    });
  }

  async remove(id: Pick<User, 'id'>['id']): Promise<User> {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
}
