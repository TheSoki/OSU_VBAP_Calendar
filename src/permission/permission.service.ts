import { PERMISSIONS_TYPE } from '@common/constant/permissions';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class PermissionService {
  constructor(private readonly prismaService: PrismaService) {}

  async add(id: Pick<User, 'id'>['id'], permission: PERMISSIONS_TYPE) {
    const userExists = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!userExists)
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);

    return this.prismaService.user.update({
      where: { id },
      data: {
        permissions: {
          connect: { name: permission },
        },
      },
    });
  }

  async remove(id: Pick<User, 'id'>['id'], permission: PERMISSIONS_TYPE) {
    const userExists = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!userExists)
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);

    return this.prismaService.user.update({
      where: { id },
      data: {
        permissions: {
          disconnect: { name: permission },
        },
      },
    });
  }

  findAll() {
    return this.prismaService.permission.findMany();
  }
}
