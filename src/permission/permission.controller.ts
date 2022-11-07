import { PERMISSIONS } from '@common/constant/permissions';
import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { PermissionService } from './permission.service';
import { PermissionGuard } from '@common/guard/permission.guard';

@ApiTags('permission')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @UseGuards(PermissionGuard(PERMISSIONS.ADMIN))
  @Put(':id/admin')
  updateToAdmin(@Param('id') id: Pick<User, 'id'>['id']) {
    return this.permissionService.update(id, [
      PERMISSIONS.ADMIN,
      PERMISSIONS.USER,
    ]);
  }

  @UseGuards(PermissionGuard(PERMISSIONS.ADMIN))
  @Put(':id/user')
  updateToUser(@Param('id') id: Pick<User, 'id'>['id']) {
    return this.permissionService.update(id, [PERMISSIONS.USER]);
  }

  @UseGuards(PermissionGuard(PERMISSIONS.ADMIN))
  @Put(':id/all')
  updateAll(@Param('id') id: Pick<User, 'id'>['id']) {
    return this.permissionService.update(id, [
      PERMISSIONS.ADMIN,
      PERMISSIONS.USER,
    ]);
  }

  @UseGuards(PermissionGuard(PERMISSIONS.ADMIN))
  @Get()
  findAll() {
    return this.permissionService.findAll();
  }
}
