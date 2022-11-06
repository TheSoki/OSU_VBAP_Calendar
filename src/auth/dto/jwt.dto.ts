import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class JwtDto {
  @IsEmail()
  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'email' })
  readonly email: string;

  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'name' })
  readonly name: string;

  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'id' })
  readonly id: string;
}
