import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import express from 'express';
import { JwtAuthGaurd } from './guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorators';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { token, user } = await this.authService.login(
      dto.email,
      dto.password,
    );
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 10 * 60 * 60 * 1000,
    });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGaurd)
  async me(@CurrentUser() req) {
    return await this.authService.getCurrentUser(req.userId);
  }
}
