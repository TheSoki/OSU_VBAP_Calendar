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

  findAll(): Promise<Note[]> {
    return this.prismaService.note.findMany();
  }

  findOne(id: Pick<Note, 'id'>['id']): Promise<Note> {
    return this.prismaService.note.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: Pick<Note, 'id'>['id'], updateNoteDto: NoteDto): Promise<Note> {
    return this.prismaService.note.update({
      where: {
        id,
      },
      data: {
        ...updateNoteDto,
      },
    });
  }

  remove(id: Pick<Note, 'id'>['id']): Promise<Note> {
    return this.prismaService.note.delete({
      where: {
        id,
      },
    });
  }
}
