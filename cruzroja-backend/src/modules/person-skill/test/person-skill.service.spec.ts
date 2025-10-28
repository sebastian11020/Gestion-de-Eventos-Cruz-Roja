import { Test, TestingModule } from '@nestjs/testing';
import { PersonSkillService } from '../person-skill.service';

describe('PersonSkillService', () => {
  let service: PersonSkillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonSkillService],
    }).compile();

    service = module.get<PersonSkillService>(PersonSkillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
