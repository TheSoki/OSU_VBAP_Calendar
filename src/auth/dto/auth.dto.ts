import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsEmail } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'email' })
  readonly email: string;

  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'password' })
  readonly password: string;
}
