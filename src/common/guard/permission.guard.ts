import { PERMISSIONS_TYPE } from '@common/constant/permissions';
import {
  CanActivate,
  ExecutionContext,
  Type,
  mixin,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { AccessTokenGuard } from './accessToken.guard';

export const PermissionGuard = (
  permission: PERMISSIONS_TYPE,
): Type<CanActivate> => {
  class PermissionGuardMixin extends AccessTokenGuard {
    prismaService: PrismaService;
    constructor() {
      super();
      this.prismaService = new PrismaService();
    }

    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest<any>();
      const user = request.user;

      const fetchedUser = await this.prismaService.user.findUnique({
        where: { id: user.id },
        include: { permissions: true },
      });

      if (!fetchedUser) {
        throw new HttpException(
          'You are not authorized to access this resource',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const hasPermission = fetchedUser.permissions.some(
        (p) => p.name === permission,
      );

      if (!hasPermission) {
        throw new HttpException(
          'You are not authorized to access this resource',
          HttpStatus.UNAUTHORIZED,
        );
      }

      return true;
    }
  }

  return mixin(PermissionGuardMixin);
};
