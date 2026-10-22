import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatsQueryDto } from './dto/statsquery.dto';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  constructor(private prismaService: PrismaService) {}

  async getStats(userId: string, linkId: number, query: StatsQueryDto) {
    const link = await this.getLinkByUserId(userId, linkId);
    const count = await this.prismaService.click.count({
      where: {
        linkId: link.id,
      },
    });
    return {
      linkId: link.id,
      shortCode: link.shortCode,
      totalClicks: count,
    };
  }

  private async getLinkByUserId(userId: string, linkId: number) {
    const findTheStats = await this.prismaService.link.findFirst({
      where: {
        userId: userId,
        id: linkId,
      },
    });
    if (!findTheStats) {
      throw new NotFoundException('Link not found for the user');
    }
    return findTheStats;
  }
}
