import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatsQueryDto } from './dto/statsquery.dto';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  constructor(private prismaService: PrismaService) {}

  async getStats(userId: string, linkId: number, query: StatsQueryDto) {
    const link = await this.findOwnedLink(userId, linkId);
    const now = new Date();
    const milliseconds: number = query.days * 24 * 60 * 60 * 1000;
    const previousTimestamp = now.getTime() - milliseconds;
    const fromDate = new Date(previousTimestamp);
    const where = { linkId: link.id, createdAt: { gte: fromDate } };
    const [
      clicksInPeriod,
      groupByBrowserResult,
      groupByDeviceResult,
      groupByOsResult,
      groupByReferrerResult,
      totalCount,
    ] = await Promise.all([
      this.prismaService.click.count({
        where,
      }),
      this.prismaService.click.groupBy({
        by: ['browser'],
        where,
        _count: {
          _all: true,
        },
        orderBy: {
          _count: {
            browser: 'desc',
          },
        },
        take: 5,
      }),
      this.prismaService.click.groupBy({
        by: ['device'],
        where,
        _count: {
          _all: true,
        },
        orderBy: {
          _count: {
            device: 'desc',
          },
        },
        take: 5,
      }),
      this.prismaService.click.groupBy({
        by: ['os'],
        where,
        _count: {
          _all: true,
        },
        orderBy: {
          _count: {
            os: 'desc',
          },
        },
        take: 5,
      }),
      this.prismaService.click.groupBy({
        by: ['referrer'],
        where,
        _count: {
          _all: true,
        },
        orderBy: {
          _count: {
            referrer: 'desc',
          },
        },
        take: 5,
      }),
      await this.prismaService.click.count({
        where: {
          linkId: link.id,
        },
      }),
    ]);
    const browsers = groupByBrowserResult.map((item) => ({
      name: item.browser,
      count: item._count._all,
    }));
    const devices = groupByDeviceResult.map((item) => ({
      name: item.device,
      count: item._count._all,
    }));
    const operatingSystems = groupByOsResult.map((item) => ({
      name: item.os,
      count: item._count._all,
    }));
    const referrers = groupByReferrerResult.map((item) => ({
      name: item.referrer ?? 'direct',
      count: item._count._all,
    }));
    return {
      linkId: link.id,
      shortCode: link.shortCode,
      totalClicks: totalCount,
      clicksInPeriod,
      browsers,
      devices,
      operatingSystems,
      referrers,
      period: {
        days: query.days,
        from: fromDate,
        to: now,
      },
    };
  }

  private async findOwnedLink(userId: string, linkId: number) {
    const link = await this.prismaService.link.findFirst({
      where: {
        userId: userId,
        id: linkId,
      },
    });
    if (!link) {
      throw new NotFoundException('Link not found for the user');
    }
    return link;
  }
}
