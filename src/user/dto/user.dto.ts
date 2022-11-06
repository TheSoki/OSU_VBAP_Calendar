import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsEmail } from 'class-validator';

export class UserDto {
  @IsEmail()
  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'email' })
  readonly email: string;

  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'name' })
  readonly name: string;
}
