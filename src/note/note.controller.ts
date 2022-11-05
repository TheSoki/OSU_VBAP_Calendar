import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { ApiTags } from '@nestjs/swagger';
import { Note } from '@prisma/client';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { NoteDto } from './dto/note.dto';
import { Request } from 'express';

@ApiTags('note')
@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Req() req: Request, @Body() createNoteDto: NoteDto) {
    const userId = req.user['id'];
    return this.noteService.create(userId, createNoteDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll() {
    return this.noteService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: Pick<Note, 'id'>['id']) {
    return this.noteService.findOne(id);
  }

  /*
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  update(
    @Param('id') id: Pick<Note, 'id'>['id'],
    @Body() updateNoteDto: NoteDto,
  ) {
    return this.noteService.update(id, updateNoteDto);
  }
  */

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: Pick<Note, 'id'>['id']) {
    return this.noteService.remove(id);
  }
}
