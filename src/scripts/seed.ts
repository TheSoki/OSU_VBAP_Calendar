import { PERMISSIONS } from '@constant/permissions';
import { Prisma, PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

const load = async () => {
  try {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
    const hashedPassword = await hash('password', saltRounds);

    const adminPermissions = await prisma.permission.create({
      data: {
        name: PERMISSIONS.ADMIN,
      },
    });

    const userPermissions = await prisma.permission.create({
      data: {
        name: PERMISSIONS.USER,
      },
    });

    await prisma.user.create({
      data: {
        email: 'admin@test.com',
        name: 'Admin',
        account: {
          create: {
            password: hashedPassword,
          },
        },
        permissions: {
          connect: [{ id: adminPermissions.id }, { id: userPermissions.id }],
        },
      },
    });

    await prisma.user.create({
      data: {
        email: 'user@test.com',
        name: 'User',
        account: {
          create: {
            password: hashedPassword,
          },
        },
        permissions: {
          connect: [{ id: userPermissions.id }],
        },
      },
    });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2002'
    ) {
      console.error('Database has already been seeded (duplicate key error)');
    } else {
      console.error(e);
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
