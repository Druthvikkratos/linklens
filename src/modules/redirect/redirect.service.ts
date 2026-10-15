import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClicksService } from '../clicks/clicks.service';

@Injectable()
export class RedirectService {
  constructor(
    private prismaService: PrismaService,
    private clickService: ClicksService,
  ) {}

  async findLinkByShortCode(shortCode: string, request: Request) {
    const link = await this.prismaService.link.findUnique({
      where: { shortCode: shortCode },
    });
    if (!link) {
      throw new NotFoundException('Link Not Found');
    }
    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
      throw new GoneException(
        `Link with ID ${link.id} existed, but it has expired.`,
      );
    }
    await this.clickService.record({
      linkId: link.id,
      userAgent: request.headers['user-agent'] ?? '',
      referrer: request.headers['referer'] ?? null,
    });
    return {
      url: link.originalUrl,
      statusCode: 302,
    };
  }
}
