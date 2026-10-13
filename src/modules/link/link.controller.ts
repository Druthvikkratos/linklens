import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LinkService } from './link.service';
import { CreateLinkDto } from './dto/create-link-dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('link')
@UseGuards(JwtAuthGuard)
export class LinkController {
  constructor(private linkService: LinkService) {}

  @Post()
  creatLink(@Body() dto: CreateLinkDto, @CurrentUser() user) {
    return this.linkService.createLink(dto, user);
  }

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
  ) {
    return this.linkService.findAllLinks(page ?? 1);
  }
}
