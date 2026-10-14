import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RedirectService {
  constructor(private prismaService: PrismaService) {}

  async findLinkByShortCode(shortCode: string) {
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
    return {
      url: link.originalUrl,
      statusCode: 302
    }
  }
}
