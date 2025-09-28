import { Test, TestingModule } from '@nestjs/testing';
import { GroupHeadquartersService } from '../group-headquarters.service';

describe('GroupHeadquartersService', () => {
  let service: GroupHeadquartersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupHeadquartersService],
    }).compile();

    service = module.get<GroupHeadquartersService>(GroupHeadquartersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
