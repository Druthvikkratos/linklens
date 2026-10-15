import { Test, TestingModule } from '@nestjs/testing';
import { ClicksService } from './clicks.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClickDto } from './dto/click-create.dto';

describe('ClicksService', () => {
  let service: ClicksService;
  const mockPrismaService = {
    click: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClicksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ClicksService>(ClicksService);
  });

  it('should create a new click', async () => {
    const sampleClick = {
      linkId: 1,
      browser: 'Chrome',
      os: 'Windows',
      device: 'Desktop',
      referrer: null,
    };
    mockPrismaService.click.create.mockResolvedValue(sampleClick);
    const mockPayload: Partial<CreateClickDto> = {
      linkId: 1,
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36',
    };
    const result = await service.record(mockPayload as CreateClickDto);
    expect(mockPrismaService.click.create).toHaveBeenCalledWith({
      data: {
        linkId: 1,
        browser: 'Chrome',
        os: 'Windows',
        device: 'Desktop',
        referrer: null,
      },
    });
    expect(result).toEqual(sampleClick);
  });

  it('should create a new click with empty user agent', async () => {
    const sampleClick = {
      linkId: 1,
      browser: 'Unknown Browser',
      os: 'Unknown Os',
      device: 'Unknown',
      referrer: null,
    };
    mockPrismaService.click.create.mockResolvedValue(sampleClick);
    const mockPayload: Partial<CreateClickDto> = {
      linkId: 1,
      userAgent: '',
    };
    const result = await service.record(mockPayload as CreateClickDto);
    expect(mockPrismaService.click.create).toHaveBeenCalledWith({
      data: {
        linkId: 1,
        browser: 'Unknown Browser',
        os: 'Unknown Os',
        device: 'Unknown',
        referrer: null,
      },
    });
    expect(result).toEqual(sampleClick);
  });
  it('should create a new click with proper referrer', async () => {
    const sampleClick = {
      linkId: 1,
      browser: 'Unknown Browser',
      os: 'Unknown Os',
      device: 'Unknown',
      referrer: 'https://google.com',
    };
    mockPrismaService.click.create.mockResolvedValue(sampleClick);
    const mockPayload: Partial<CreateClickDto> = {
      linkId: 1,
      userAgent: '',
      referrer: 'https://google.com',
    };
    const result = await service.record(mockPayload as CreateClickDto);
    expect(mockPrismaService.click.create).toHaveBeenCalledWith({
      data: {
        linkId: 1,
        browser: 'Unknown Browser',
        os: 'Unknown Os',
        device: 'Unknown',
        referrer: 'https://google.com',
      },
    });
    expect(result).toEqual(sampleClick);
  });
  it('should record a click from a mobile device.', async () => {
    const sampleClick = {
      linkId: 2,
      browser: 'Mobile Chrome',
      os: 'Android',
      device: 'mobile',
      referrer: null,
    };
    mockPrismaService.click.create.mockResolvedValue(sampleClick);
    const mockPayload: Partial<CreateClickDto> = {
      linkId: 2,
      userAgent:
        'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.8059.80 Mobile Safari/537.36',
    };
    const result = await service.record(mockPayload as CreateClickDto);
    expect(mockPrismaService.click.create).toHaveBeenCalledWith({
      data: {
        linkId: 2,
        browser: 'Mobile Chrome',
        os: 'Android',
        device: 'mobile',
        referrer: null,
      },
    });
    expect(result).toEqual(sampleClick);
  });
  it('should record a click with unknown user agent and referrer.', async () => {
    const sampleClick = {
      linkId: 3,
      browser: 'Unknown Browser',
      os: 'Unknown Os',
      device: 'Unknown',
      referrer: 'https://example.com',
    };
    mockPrismaService.click.create.mockResolvedValue(sampleClick);
    const mockPayload: Partial<CreateClickDto> = {
      linkId: 3,
      userAgent: 'unknown-agent',
      referrer: 'https://example.com',
    };
    const result = await service.record(mockPayload as CreateClickDto);
    expect(mockPrismaService.click.create).toHaveBeenCalledWith({
      data: {
        linkId: 3,
        browser: 'Unknown Browser',
        os: 'Unknown Os',
        device: 'Unknown',
        referrer: 'https://example.com',
      },
    });
    expect(result).toEqual(sampleClick);
  });

  it('should create only one click record.', async () => {
    const sampleClick = {
      linkId: 1,
      browser: 'Chrome',
      os: 'Windows',
      device: 'Desktop',
      referrer: null,
    };
    mockPrismaService.click.create.mockResolvedValue(sampleClick);
    const mockPayload: Partial<CreateClickDto> = {
      linkId: 1,
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36',
    };
    await service.record(mockPayload as CreateClickDto);
    expect(mockPrismaService.click.create).toHaveBeenCalledTimes(1);
  });
});
