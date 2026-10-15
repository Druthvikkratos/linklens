import {
  GoneException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClicksService } from '../clicks/clicks.service';

@Injectable()
export class RedirectService {
  private readonly logger = new Logger(RedirectService.name);
  constructor(
    private prismaService: PrismaService,
    private clickService: ClicksService,
  ) {}

  async findLinkByShortCode(shortCode: string, request: Request) {
    this.logger.log(`Finding a new link using short code: ${shortCode}`);
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
    this.clickService.record(
      link.id,
      request.headers['user-agent'] ?? '',
      request.headers['referer'] ?? null,
    ).catch((error: any) => {
      this.logger.error('Failed to record click', error.stack);
    })
    return {
      url: link.originalUrl,
      statusCode: 302,
    };
  }
}
