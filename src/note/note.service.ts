import { PERMISSIONS } from '@common/constant/permissions';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Note, User } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { NoteDto } from './dto/note.dto';

@Injectable()
export class NoteService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    userId: Pick<User, 'id'>['id'],
    createNoteDto: NoteDto,
  ): Promise<Note> {
    const userExists = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!userExists)
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);

    return this.prismaService.note.create({
      data: {
        title: createNoteDto.title,
        content: createNoteDto.content,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findAll(userId: Pick<User, 'id'>['id']): Promise<Note[]> {
    const isAdmin = await this.isAdmin(userId);

    if (isAdmin) {
      return this.prismaService.note.findMany();
    } else {
      return this.prismaService.note.findMany({
        where: {
          user: {
            id: userId,
          },
        },
      });
    }
  }

  async findOne(
    id: Pick<Note, 'id'>['id'],
    userId: Pick<User, 'id'>['id'],
  ): Promise<Note> {
    const isAdmin = await this.isAdmin(userId);

    const note = await this.prismaService.note.findUnique({
      where: {
        id,
      },
    });

    if (!note) {
      throw new HttpException('Note does not exist', HttpStatus.BAD_REQUEST);
    }

    if (isAdmin || note.userId === userId) {
      return note;
    } else {
      throw new HttpException(
        'You are not authorized to view this note',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async update(
    id: Pick<Note, 'id'>['id'],
    updateNoteDto: NoteDto,
    userId: Pick<User, 'id'>['id'],
  ): Promise<Note> {
    const isAdmin = await this.isAdmin(userId);

    const note = await this.prismaService.note.findUnique({
      where: {
        id,
      },
    });

    if (!note) {
      throw new HttpException('Note does not exist', HttpStatus.BAD_REQUEST);
    }

    if (isAdmin || note.userId === userId) {
      return this.prismaService.note.update({
        where: {
          id,
        },
        data: {
          ...updateNoteDto,
        },
      });
    } else {
      throw new HttpException(
        'You are not authorized to update this note',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async remove(
    id: Pick<Note, 'id'>['id'],
    userId: Pick<User, 'id'>['id'],
  ): Promise<Note> {
    const isAdmin = await this.isAdmin(userId);

    const note = await this.prismaService.note.findUnique({
      where: {
        id,
      },
    });

    if (!note) {
      throw new HttpException('Note does not exist', HttpStatus.BAD_REQUEST);
    }

    if (isAdmin || note.userId === userId) {
      return this.prismaService.note.delete({
        where: {
          id,
        },
      });
    } else {
      throw new HttpException(
        'You are not authorized to delete this note',
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
