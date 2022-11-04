import { User } from '@prisma/client';

export type UserDto = Pick<User, 'email' | 'name' | 'password'>;
