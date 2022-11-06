import { AccessTokenGuard } from '@common/guard/accessToken.guard';
import { PERMISSIONS } from '@constant/permissions';
import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { PermissionService } from './permission.service';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @UseGuards(AccessTokenGuard)
  @Put(':id/admin')
  updateToAdmin(@Param('id') id: Pick<User, 'id'>['id']) {
    return this.permissionService.update(id, [PERMISSIONS.ADMIN]);
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id/user')
  updateToUser(@Param('id') id: Pick<User, 'id'>['id']) {
    return this.permissionService.update(id, [PERMISSIONS.USER]);
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id/all')
  updateAll(@Param('id') id: Pick<User, 'id'>['id']) {
    return this.permissionService.update(id, [
      PERMISSIONS.ADMIN,
      PERMISSIONS.USER,
    ]);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll() {
    return this.permissionService.findAll();
  }
}
