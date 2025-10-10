import { Test, TestingModule } from '@nestjs/testing';
import { EpsPersonService } from '../eps-person.service';

describe('EpsPersonService', () => {
  let service: EpsPersonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EpsPersonService],
    }).compile();

    service = module.get<EpsPersonService>(EpsPersonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
