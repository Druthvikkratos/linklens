import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { RedirectService } from './redirect.service';

@Controller('redirect')
export class RedirectController {
  constructor(private redirectService: RedirectService) {}

  @Get(':code')
  @Redirect('https://docs.nestjs.com', 302)
  async findAll(@Param('code') shortCode: string) {
    return this.redirectService.findLinkByShortCode(shortCode);
  }
}
