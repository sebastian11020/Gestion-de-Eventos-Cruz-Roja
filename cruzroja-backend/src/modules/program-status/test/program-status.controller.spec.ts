import { Test, TestingModule } from '@nestjs/testing';
import { ProgramStatusController } from '../program-status.controller';

describe('ProgramStatusController', () => {
  let controller: ProgramStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgramStatusController],
    }).compile();

    controller = module.get<ProgramStatusController>(ProgramStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
