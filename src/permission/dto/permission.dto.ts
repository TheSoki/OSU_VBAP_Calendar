import { PERMISSIONS, PERMISSIONS_TYPE } from '@common/constant/permissions';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class PermissionDto {
  @IsEnum(PERMISSIONS)
  @ApiProperty({ type: 'string', description: 'permission name (ADMIN/USER)' })
  readonly permission: PERMISSIONS_TYPE;
}
