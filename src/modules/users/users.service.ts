import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private prismaService: PrismaService) {}

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

  async getUserByEmail(email: string): Promise<User> {
    this.logger.log(`find user by email: ${email}`);
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      this.logger.warn(`User not found: ${email}`);
      throw new NotFoundException('User Not Found');
    }
    return user;
  }
}
