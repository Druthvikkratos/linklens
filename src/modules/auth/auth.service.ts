import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';
import bcrypt from 'node_modules/bcryptjs/umd/types';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createUser(payload: CreateUserDto): Promise<User> {
    this.logger.log(`Creating user: ${payload.email}`);
    const existing = await this.prismaService.user.findUnique({
      where: { email: payload.email },
    });
    if (existing) {
      this.logger.warn(
        `User creation blocked — email already in use: ${payload.email}`,
      );
      throw new BadRequestException('Email already in use');
    }
    const passwordHash = await bcrypt.hash(payload.password, 10);
    const { password, ...rest } = payload;
    const user = await this.prismaService.user.create({
      data: {
        ...rest,
        password: passwordHash,
      },
    });
    this.logger.log(`User created: ${user.id} (${user.email})`);
    return user;
  }

  async login(email: string, password: string) {
    let user: any;
    user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid Creditials');
    }
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid Creditials');
    }
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload, {
      expiresIn: (process.env.JWT_EXPIRY as any) || '10h',
    });
    return { token, user };
  }
}
