import { Test, TestingModule } from '@nestjs/testing';
import { EpsPersonController } from '../eps-person.controller';

describe('EpsPersonController', () => {
  let controller: EpsPersonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EpsPersonController],
    }).compile();

    controller = module.get<EpsPersonController>(EpsPersonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
