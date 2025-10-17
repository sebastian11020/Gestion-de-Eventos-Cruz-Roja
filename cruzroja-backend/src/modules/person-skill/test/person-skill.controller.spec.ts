import { Test, TestingModule } from '@nestjs/testing';
import { PersonSkillController } from '../person-skill.controller';

describe('PersonSkillController', () => {
  let controller: PersonSkillController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonSkillController],
    }).compile();

    controller = module.get<PersonSkillController>(PersonSkillController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
