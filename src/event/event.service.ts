import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Event, User } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { EventDto } from './dto/event.dto';
import { PERMISSIONS } from '@common/constant/permissions';

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

  async findAll(userId: Pick<User, 'id'>['id']): Promise<Event[]> {
    const isAdmin = await this.isAdmin(userId);

    if (isAdmin) {
      return this.prismaService.event.findMany();
    } else {
      return this.prismaService.event.findMany({
        where: {
          user: {
            id: userId,
          },
        },
      });
    }
  }

  async findOne(
    id: Pick<Event, 'id'>['id'],
    userId: Pick<User, 'id'>['id'],
  ): Promise<Event> {
    const isAdmin = await this.isAdmin(userId);

    const event = await this.prismaService.event.findUnique({
      where: {
        id,
      },
    });

    if (isAdmin || event.userId === userId) {
      return event;
    } else {
      throw new HttpException(
        'You are not authorized to view this event',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async update(
    id: Pick<Event, 'id'>['id'],
    updateEventDto: EventDto,
    userId: Pick<User, 'id'>['id'],
  ): Promise<Event> {
    const isAdmin = await this.isAdmin(userId);

    const event = await this.prismaService.event.findUnique({
      where: {
        id,
      },
    });

    if (!event) {
      throw new HttpException('Event does not exist', HttpStatus.BAD_REQUEST);
    }

    if (isAdmin || event.userId === userId) {
      return this.prismaService.event.update({
        where: {
          id,
        },
        data: {
          ...updateEventDto,
        },
      });
    } else {
      throw new HttpException(
        'You are not authorized to update this event',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async remove(
    id: Pick<Event, 'id'>['id'],
    userId: Pick<User, 'id'>['id'],
  ): Promise<Event> {
    const isAdmin = await this.isAdmin(userId);

    const event = await this.prismaService.event.findUnique({
      where: {
        id,
      },
    });

    if (!event) {
      throw new HttpException('Event does not exist', HttpStatus.BAD_REQUEST);
    }

    if (isAdmin || event.userId === userId) {
      return this.prismaService.event.delete({
        where: {
          id,
        },
      });
    } else {
      throw new HttpException(
        'You are not authorized to delete this event',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async isAdmin(userId: Pick<User, 'id'>['id']) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { permissions: true },
    });

    if (!user) {
      return false;
    }

    return user.permissions.some(
      (permission) => permission.name === PERMISSIONS.ADMIN,
    );
  }
}
