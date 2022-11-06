import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, MinLength } from 'class-validator';

export class EventDto {
  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'title' })
  readonly title: string;

  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'content' })
  readonly content: string;

  @IsDate()
  @ApiProperty({ type: Date, description: 'start' })
  readonly start: Date;

  @IsDate()
  @ApiProperty({ type: Date, description: 'end' })
  readonly end: Date;
}
