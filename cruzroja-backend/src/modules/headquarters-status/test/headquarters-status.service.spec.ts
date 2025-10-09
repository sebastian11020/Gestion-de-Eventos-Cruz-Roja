import { Test, TestingModule } from '@nestjs/testing';
import { HeadquartersStatusService } from '../headquarters-status.service';

describe('HeadquartersStatusService', () => {
  let service: HeadquartersStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeadquartersStatusService],
    }).compile();

    service = module.get<HeadquartersStatusService>(HeadquartersStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
