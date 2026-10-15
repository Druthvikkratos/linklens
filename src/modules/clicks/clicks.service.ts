import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClickDto } from './dto/click-create.dto';
import { UAParser } from 'ua-parser-js';

@Injectable()
export class ClicksService {
  constructor(private prismaService: PrismaService) {}

  async record(payload: CreateClickDto) {
    const userAgent = payload.userAgent || '';
    const parser = new UAParser(userAgent);

    const browserName: string | undefined = parser.getBrowser().name;
    const osName: string | undefined = parser.getOS().name;
    const deviceType: string | undefined = parser.getDevice().type;

    const finalBrowser: string = browserName || 'Unknown Browser';
    const finalOs: string = osName || 'Unknown Os';
    let finalDevice: string = '';
    if (deviceType) {
      finalDevice = deviceType;
    } else if (browserName || osName) {
      finalDevice = 'Desktop';
    } else if (!deviceType && !browserName && !osName) {
      finalDevice = 'Unknown';
    }
    const link = await this.prismaService.click.create({
      data: {
        linkId: payload.linkId,
        browser: finalBrowser,
        os: finalOs,
        device: finalDevice,
        referrer: payload.referrer ?? null,
      },
    });
    return link;
  }
}
