import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { describe } from 'node:test';
import * as bcrypt from 'bcryptjs';

import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('mocked_hashed_password'),
  compare: jest.fn().mockResolvedValue(true)
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  const mockUserService = {
    createUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsersService, useValue: mockUserService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('createUser', () => {
    it('should successfully create and return a user via UsersService', async () => {
      const payload = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      };

      const expectedUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      };

      mockUserService.createUser.mockResolvedValue(expectedUser);

      const result = await authService.createUser(payload);

      expect(usersService.createUser).toHaveBeenCalledWith(payload);
      expect(usersService.createUser).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedUser);
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('login', () => {
    jest.mock('bcrypt');
    const user = {
      id: 'user-1',
      email: 'test@example.com',
      password: 'hashed-password',
    };
    it('should return a token and user for valid credentials', async () => {
      jest.spyOn(mockPrismaService.user, 'findUnique').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');
      const result = await authService.login(
        'test@example.com',
        'Password123!',
      );
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
      });
      expect(result).toEqual({
        token: 'mock-jwt-token',
        user,
      });
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(
        authService.login('unknown@example.com', 'Password123!'),
      ).rejects.toThrow(new UnauthorizedException('Invalid Credentials'));
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      await expect(
        authService.login('test@example.com', 'WrongPassword'),
      ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
    });
  });

  describe('getCurrenrUser', () => {
    it('should return current user', async () => {
      const user = {
        id: 'user-1',
        email: 'test@example.com',
      };
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      const result = await authService.getCurrentUser('user-1');

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: {
          id: true,
          email: true,
        },
      });
      expect(result).toEqual(user);
    });
    it('should throw UnauthorizedException when user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(authService.getCurrentUser('unknown-user')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
