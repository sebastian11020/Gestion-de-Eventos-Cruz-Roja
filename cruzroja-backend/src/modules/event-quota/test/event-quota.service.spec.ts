import { Test, TestingModule } from '@nestjs/testing';
import { EventQuotaService } from '../event-quota.service';

describe('EventQuotaService', () => {
  let service: EventQuotaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventQuotaService],
    }).compile();

    service = module.get<EventQuotaService>(EventQuotaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
