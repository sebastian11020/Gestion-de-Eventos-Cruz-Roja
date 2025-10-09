import { Test, TestingModule } from '@nestjs/testing';
import { PersonStatusService } from '../person-status.service';

describe('PersonStatusService', () => {
  let service: PersonStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonStatusService],
    }).compile();

    service = module.get<PersonStatusService>(PersonStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
