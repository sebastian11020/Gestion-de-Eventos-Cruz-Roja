import { Test, TestingModule } from '@nestjs/testing';
import { GroupStatusService } from '../group-status.service';

describe('GroupStatusService', () => {
  let service: GroupStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupStatusService],
    }).compile();

    service = module.get<GroupStatusService>(GroupStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
