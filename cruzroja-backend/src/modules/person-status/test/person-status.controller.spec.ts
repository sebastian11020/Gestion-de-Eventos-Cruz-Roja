import { Test, TestingModule } from '@nestjs/testing';
import { PersonStatusController } from '../person-status.controller';

describe('PersonStatusController', () => {
  let controller: PersonStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonStatusController],
    }).compile();

    controller = module.get<PersonStatusController>(PersonStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
