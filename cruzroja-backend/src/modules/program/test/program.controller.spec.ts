import { Test, TestingModule } from '@nestjs/testing';
import { ProgramController } from '../program.controller';

describe('ProgramController', () => {
  let controller: ProgramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgramController],
    }).compile();

    controller = module.get<ProgramController>(ProgramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
