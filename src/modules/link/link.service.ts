import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLinkDto } from './dto/create-link-dto';
import { encode } from 'src/data-structures/base62/base62';
import { ConfigService } from '@nestjs/config';
import { LinkQueryDto } from './dto/link-query-dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class LinkService {
  private readonly logger = new Logger(LinkService.name);
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async createLink(payload: CreateLinkDto, userId: string) {
    this.logger.log(`Creating a new short link for user: ${userId}`);
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const newUrl = await tx.link.create({
          data: {
            shortCode: crypto.randomUUID(),
            originalUrl: payload.originalUrl,
            userId: userId,
            expiresAt: payload.expiresAt,
          },
        });
        this.logger.debug(`Link record created with ID: ${newUrl.id}`);
        const generatedShortCode = encode(newUrl.id);
        const updateUrl = await tx.link.update({
          where: { id: newUrl.id },
          data: { shortCode: generatedShortCode },
        });
        this.logger.log(
          `Short link created successfully. Link ID: ${updateUrl.id}`,
        );
        return {
          ...updateUrl,
          shortUrl:
            this.configService.getOrThrow<string>('BASE_URL') +
            '/' +
            updateUrl.shortCode,
        };
      });
    } catch (error) {
      this.logger.error(
        `Failed to create short link for user: ${userId}`,
        error instanceof Error ? error.stack : String(error),
      );

      throw error;
    }
  }

  async findAllLinks(query: LinkQueryDto, userId: string) {
    const {
      page = 1,
      limit = 50,
      sortField = 'createdAt',
      sortDir = 'desc',
    } = query;

    this.logger.log(
      `Fetching links for user: ${userId}, page: ${page}, limit: ${limit}`,
    );
    try {
      const where: Prisma.LinkWhereInput = { userId };
      const [data, total] = await this.prismaService.$transaction([
        this.prismaService.link.findMany({
          where,
          take: limit,
          skip: (page - 1) * limit,
          orderBy: { [sortField]: sortDir },
        }),
        this.prismaService.link.count({ where }),
      ]);
      this.logger.log(
        `Fetched ${data.length} links for user: ${userId}. Total: ${total}`,
      );
      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch links for user: ${userId}`,
        error instanceof Error ? error.stack : String(error),
      );

      throw error;
    }
  }
}
