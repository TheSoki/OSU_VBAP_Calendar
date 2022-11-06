import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, MinLength } from 'class-validator';

export class EventDto {
  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'title' })
  title: string;

  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'content' })
  content: string;

  @IsDate()
  @ApiProperty({ type: Date, description: 'start' })
  start: Date;

  @IsDate()
  @ApiProperty({ type: Date, description: 'end' })
  end: Date;
}
