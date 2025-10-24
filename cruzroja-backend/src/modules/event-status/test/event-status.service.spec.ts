import { Test, TestingModule } from '@nestjs/testing';
import { EventStatusService } from '../event-status.service';

describe('EventStatusService', () => {
  let service: EventStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventStatusService],
    }).compile();

    service = module.get<EventStatusService>(EventStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
