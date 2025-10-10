import { Test, TestingModule } from '@nestjs/testing';
import { EpsService } from '../eps.service';

describe('EpsService', () => {
  let service: EpsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EpsService],
    }).compile();

    service = module.get<EpsService>(EpsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
