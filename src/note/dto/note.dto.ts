import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class NoteDto {
  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'title' })
  readonly title: string;

  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'content' })
  readonly content: string;
}
