import { Test, TestingModule } from '@nestjs/testing';
import { EpsController } from '../eps.controller';

describe('EpsController', () => {
  let controller: EpsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EpsController],
    }).compile();

    controller = module.get<EpsController>(EpsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
