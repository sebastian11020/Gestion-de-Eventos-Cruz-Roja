import { Test, TestingModule } from '@nestjs/testing';
import { ManagerEventService } from '../manager-event.service';

describe('ManagerEventService', () => {
  let service: ManagerEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManagerEventService],
    }).compile();

    service = module.get<ManagerEventService>(ManagerEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
