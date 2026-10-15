import { Controller, Get, Param, Redirect, Req } from '@nestjs/common';
import { RedirectService } from './redirect.service';

@Controller('redirect')
export class RedirectController {
  constructor(private redirectService: RedirectService) {}

  @Get(':code')
  @Redirect('https://docs.nestjs.com', 302)
  async findAll(@Param('code') shortCode: string, @Req() request: Request) {
    return this.redirectService.findLinkByShortCode(shortCode, request  );
  }
}
