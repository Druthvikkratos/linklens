import { Test, TestingModule } from '@nestjs/testing';
import { RedirectService } from './redirect.service';
import { PrismaService } from '../prisma/prisma.service';
import { ClicksService } from '../clicks/clicks.service';
import { GoneException, NotFoundException } from '@nestjs/common';

describe('RedirectService', () => {
  let service: RedirectService;
  const mockPrismaService = {
    link: {
      findUnique: jest.fn(),
    },
  };
  const mockClickService = {
    record: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedirectService,
        ClicksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ClicksService,
          useValue: mockClickService,
        },
      ],
    }).compile();

    service = module.get<RedirectService>(RedirectService);
  });

  it('should get link and save click', async () => {
    const mockLink = {
      id: 1,
      shortCode: '1',
      originalUrl: 'https://ssinformatics.com/',
      expiresAt: null,
    };
    const headers = {
      'user-agent': 'Mozilla/5.0 Chrome/...',
      referer: 'https://example.com',
    };
    const mockPayload = {
      shortCode: '1',
      request: {
        headers,
      } as unknown as Request,
    };
    mockPrismaService.link.findUnique.mockResolvedValue(mockLink);
    mockClickService.record.mockResolvedValue(null);
    const result = await service.findLinkByShortCode(
      mockPayload.shortCode,
      mockPayload.request as Request,
    );
    expect(result).toEqual({
      url: mockLink.originalUrl,
      statusCode: 302,
    });
    expect(mockClickService.record).toHaveBeenCalledWith({
      linkId: mockLink.id,
      userAgent: mockPayload.request.headers['user-agent'] ?? '',
      referrer: mockPayload.request.headers['referer'] ?? null,
    });
  });

  it('should throw NotFoundException when link does not exist', async () => {
    const headers = {
      'user-agent': 'Mozilla/5.0 Chrome/...',
      referer: 'https://example.com',
    };
    const mockPayload = {
      shortCode: '1',
      request: {
        headers,
      } as unknown as Request,
    };
    mockClickService.record.mockResolvedValue(null);
    await expect(
      service.findLinkByShortCode(mockPayload.shortCode, mockPayload.request),
    ).rejects.toThrow(NotFoundException);
    expect(mockClickService.record).not.toHaveBeenCalled();
  });

  it('should throw gone for expired link', async () => {
    const mockLink = {
      id: 1,
      shortCode: '1',
      originalUrl: 'https://ssinformatics.com/',
      expiresAt: new Date('2020-01-01T00:00:00.000Z'),
    };
    const headers = {
      'user-agent': 'Mozilla/5.0 Chrome/...',
      referer: 'https://example.com',
    };
    const mockPayload = {
      shortCode: '1',
      request: {
        headers,
      } as unknown as Request,
    };
    mockPrismaService.link.findUnique.mockResolvedValue(mockLink);
    mockClickService.record.mockResolvedValue(null);
    await expect(
      service.findLinkByShortCode(mockPayload.shortCode, mockPayload.request),
    ).rejects.toThrow(GoneException);
    expect(mockClickService.record).not.toHaveBeenCalled();
  });
});
