import { Test, TestingModule } from '@nestjs/testing';
import { HeadquartersService } from '../headquarters.service';

describe('HeadquartersService', () => {
  let service: HeadquartersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeadquartersService],
    }).compile();

    service = module.get<HeadquartersService>(HeadquartersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
