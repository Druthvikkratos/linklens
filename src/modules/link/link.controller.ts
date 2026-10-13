import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LinkService } from './link.service';
import { CreateLinkDto } from './dto/create-link-dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('link')
@UseGuards(JwtAuthGuard)
export class LinkController {
  constructor(private linkService: LinkService) {}

  @Post('')
  creatLink(@Body() dto: CreateLinkDto, @CurrentUser() user) {
    return this.linkService.createLink(dto, user);
  }
}
