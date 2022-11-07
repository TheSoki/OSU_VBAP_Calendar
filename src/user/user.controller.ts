import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { PERMISSIONS } from '@common/constant/permissions';
import { PermissionGuard } from '@common/guard/permission.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(PermissionGuard(PERMISSIONS.ADMIN))
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(PermissionGuard(PERMISSIONS.ADMIN))
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(PermissionGuard(PERMISSIONS.ADMIN))
  @Get(':id')
  findOne(@Param('id') id: Pick<User, 'id'>['id']) {
    return this.userService.findOne(id);
  }

  @UseGuards(PermissionGuard(PERMISSIONS.ADMIN))
  @Put(':id')
  update(
    @Param('id') id: Pick<User, 'id'>['id'],
    @Body() updateUserDto: UserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(PermissionGuard(PERMISSIONS.ADMIN))
  @Delete(':id')
  remove(@Param('id') id: Pick<User, 'id'>['id']) {
    return this.userService.remove(id);
  }
}
