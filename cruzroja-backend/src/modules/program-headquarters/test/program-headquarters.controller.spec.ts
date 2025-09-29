import { Test, TestingModule } from '@nestjs/testing';
import { ProgramHeadquartersController } from '../program-headquarters.controller';

describe('ProgramHeadquartersController', () => {
  let controller: ProgramHeadquartersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgramHeadquartersController],
    }).compile();

    controller = module.get<ProgramHeadquartersController>(
      ProgramHeadquartersController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
