import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Event, User } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { EventDto } from './dto/event.dto';

@Injectable()
export class EventService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    userId: Pick<User, 'id'>['id'],
    createEventDto: EventDto,
  ): Promise<Event> {
    const userExists = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!userExists)
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);

    return this.prismaService.event.create({
      data: {
        title: createEventDto.title,
        content: createEventDto.content,
        start: new Date(createEventDto.start),
        end: new Date(createEventDto.end),
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  findAll(): Promise<Event[]> {
    return this.prismaService.event.findMany();
  }

  findOne(id: Pick<Event, 'id'>['id']): Promise<Event> {
    return this.prismaService.event.findUnique({
      where: {
        id,
      },
    });
  }

  update(
    id: Pick<Event, 'id'>['id'],
    updateEventDto: EventDto,
  ): Promise<Event> {
    return this.prismaService.event.update({
      where: {
        id,
      },
      data: {
        ...updateEventDto,
      },
    });
  }

  remove(id: Pick<Event, 'id'>['id']): Promise<Event> {
    return this.prismaService.event.delete({
      where: {
        id,
      },
    });
  }
}
