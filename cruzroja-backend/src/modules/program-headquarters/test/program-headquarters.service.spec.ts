import { Test, TestingModule } from '@nestjs/testing';
import { ProgramHeadquartersService } from '../program-headquarters.service';

describe('ProgramHeadquartersService', () => {
  let service: ProgramHeadquartersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgramHeadquartersService],
    }).compile();

    service = module.get<ProgramHeadquartersService>(
      ProgramHeadquartersService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
