import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NoteModule } from './note/note.module';
import { EventModule } from './event/event.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [AuthModule, UserModule, NoteModule, EventModule, PermissionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
