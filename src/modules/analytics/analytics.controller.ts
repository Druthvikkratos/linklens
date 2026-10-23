import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StatsQueryDto } from './dto/statsquery.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorators';
import { AnalyticsService } from './analytics.service';

@Controller('links')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private analyticService: AnalyticsService) {}

  @Get(':id/stats')
  async findAll(
    @CurrentUser() user,
    @Param('id', ParseIntPipe) id: number,
    @Query() query: StatsQueryDto,
  ) {
    return this.analyticService.getStats(user.userId, id, query);
  }
}
