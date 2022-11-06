import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class NoteDto {
  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'title' })
  title: string;

  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'content' })
  content: string;
}
