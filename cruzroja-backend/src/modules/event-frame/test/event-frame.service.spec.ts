import { Test, TestingModule } from '@nestjs/testing';
import { EventFrameService } from '../event-frame.service';

describe('EventFrameService', () => {
  let service: EventFrameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventFrameService],
    }).compile();

    service = module.get<EventFrameService>(EventFrameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
