import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: Pick<User, 'id'>['id']) {
    return this.userService.findOne(id);
  }

  /*
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  update(
    @Param('id') id: Pick<User, 'id'>['id'],
    @Body() updateUserDto: UserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }
  */

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: Pick<User, 'id'>['id']) {
    return this.userService.remove(id);
  }
}
