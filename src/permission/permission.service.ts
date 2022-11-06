import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PERMISSIONSTYPE } from 'src/constansts/permissions';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionService {
  constructor(private readonly prismaService: PrismaService) {}

  async update(id: Pick<User, 'id'>['id'], permissions: PERMISSIONSTYPE[]) {
    const userExists = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!userExists)
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);

    return this.prismaService.user.update({
      where: { id },
      data: {
        permissions: {
          set: permissions.map((permission) => ({ name: permission })),
        },
      },
    });
  }

  findAll() {
    return this.prismaService.permission.findMany();
  }
}
