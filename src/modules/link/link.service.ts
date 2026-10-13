import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLinkDto } from './dto/create-link-dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorators';
import { encode } from 'src/data-structures/base62/base62';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LinkService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async createLink(payload: CreateLinkDto, @CurrentUser() user) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const newUrl = await tx.link.create({
          data: {
            shortCode: 'Temp-Code',
            originalUrl: payload.originalUrl,
            userId: user.userId,
          },
        });
        const generatedShortCode = encode(newUrl.id);
        const updateUrl = await tx.link.update({
          where: { id: newUrl.id },
          data: { shortCode: generatedShortCode },
        });

        return {
          ...updateUrl,
          shortUrl:
            this.configService.getOrThrow<string>('BASE_URL') +
            '/' +
            updateUrl.shortCode,
        };
      });
    } catch (error) {
      console.error('Failed to create link:', error);
      throw error;
    }
  }

  async findAllLinks(page: number = 1) {
    try {
      const limit = 50;
      const skip = (page - 1) * limit;
      const [totalCount, data] = await this.prismaService.$transaction([
        this.prismaService.link.count(),
        this.prismaService.link.findMany({
          take: limit,
          skip: skip,
          orderBy: {
            createdAt: 'desc',
          },
        }),
      ]);
      return {
        data,
        meta: {
          totalCount,
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          hasNextPage: skip + data.length < totalCount,
          hasPreviousPage: page > 1,
        },
      };
    } catch (error) {}
  }
}
