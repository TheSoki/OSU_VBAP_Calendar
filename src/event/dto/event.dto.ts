import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, MinLength } from 'class-validator';

export class EventDto {
  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'title' })
  readonly title: string;

  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'content' })
  readonly content: string;

  @IsDateString()
  @ApiProperty({ type: Date, description: 'start' })
  readonly start: Date;

  @IsDateString()
  @ApiProperty({ type: Date, description: 'end' })
  readonly end: Date;
}
