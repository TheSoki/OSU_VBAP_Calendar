import { PERMISSIONS } from '@common/constant/permissions';
import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { PermissionGuard } from '@common/guard/permission.guard';
import { Request } from 'express';
import { PermissionDto } from './dto/permission.dto';

@ApiTags('permission')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @UseGuards(PermissionGuard(PERMISSIONS.ADMIN))
  @Put(':id')
  grantPermission(@Req() req: Request, @Body() body: PermissionDto) {
    //? using @Req because @Param decorator does not work well with custom validator guards
    //? see https://stackoverflow.com/questions/55481224/nestjs-how-to-access-both-body-and-param-in-custom-validator
    return this.permissionService.add(req.params.id, body.permission);
  }

  @UseGuards(PermissionGuard(PERMISSIONS.ADMIN))
  @Get()
  findAll() {
    return this.permissionService.findAll();
  }
}
