import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { EventService } from './event.service';
import { EventDto } from './dto/event.dto';
import { Event } from '@prisma/client';
import { AccessTokenGuard } from '@common/guard/accessToken.guard';

@ApiTags('event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Req() req: Request, @Body() createEventDto: EventDto) {
    const userId = req.user['id'];
    return this.eventService.create(userId, createEventDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: Pick<Event, 'id'>['id']) {
    return this.eventService.findOne(id);
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  update(
    @Param('id') id: Pick<Event, 'id'>['id'],
    @Body() updateEventDto: EventDto,
  ) {
    return this.eventService.update(id, updateEventDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: Pick<Event, 'id'>['id']) {
    return this.eventService.remove(id);
  }
}
