import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UAParser } from 'ua-parser-js';

@Injectable()
export class ClicksService {
  constructor(private prismaService: PrismaService) {}

  async record(linkId: number, userAgent: string, referrer?: string, ) {
    const getUserAgent = userAgent || '';
    const parser = new UAParser(getUserAgent);

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
    } else {
      finalDevice = 'Unknown';
    }
    const click = await this.prismaService.click.create({
      data: {
        linkId: linkId,
        browser: finalBrowser,
        os: finalOs,
        device: finalDevice,
        referrer: referrer ?? null,
      },
    });
    return click;
  }
}
