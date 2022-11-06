import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';
import { JwtDto } from './dto/jwt.dto';
import { compare, hash } from 'bcrypt';
import { PrismaService } from '@prisma/prisma.service';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { PERMISSIONS } from '@constant/permissions';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<any> {
    const userExists = await this.prismaService.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (userExists)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.prismaService.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        account: {
          create: {
            password: hash,
          },
        },
        permissions: {
          connect: {
            name: PERMISSIONS.USER,
          },
        },
      },
    });

    const tokens = await this.getTokens(newUser);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);

    return tokens;
  }

  async login(data: AuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: data.email },
      include: { account: true },
    });
    if (!user)
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);

    const passwordMatches = await compare(data.password, user.account.password);

    if (!passwordMatches)
      throw new HttpException('Password is incorrect', HttpStatus.BAD_REQUEST);

    const tokens = await this.getTokens(user);

    return tokens;
  }

  async logout(email: string) {
    return this.prismaService.user.update({
      where: { email },
      data: { account: { update: { refreshToken: null } } },
    });
  }

  hashData(data: string) {
    const saltRounds = parseInt(
      this.configService.get<string>('BCRYPT_SALT_ROUNDS'),
    );
    return hash(data, saltRounds);
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.prismaService.user.update({
      where: { id },
      data: { account: { update: { refreshToken: hashedRefreshToken } } },
    });
  }

  async getTokens(jwtPayload: JwtDto) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          ...jwtPayload,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          ...jwtPayload,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(id: string, refreshToken: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: { account: true },
    });

    if (!user || !user.account.refreshToken)
      throw new HttpException('Access Denied', HttpStatus.UNAUTHORIZED);

    const refreshTokenMatches = await compare(
      refreshToken,
      user.account.refreshToken,
    );

    if (!refreshTokenMatches)
      throw new HttpException('Access Denied', HttpStatus.UNAUTHORIZED);

    const tokens = await this.getTokens(user);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }
}
