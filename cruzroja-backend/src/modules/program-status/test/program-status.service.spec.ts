import { Test, TestingModule } from '@nestjs/testing';
import { ProgramStatusService } from '../program-status.service';

describe('ProgramStatusService', () => {
  let service: ProgramStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgramStatusService],
    }).compile();

    service = module.get<ProgramStatusService>(ProgramStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
