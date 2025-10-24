import { Test, TestingModule } from '@nestjs/testing';
import { ManagerEventController } from '../manager-event.controller';

describe('ManagerEventController', () => {
  let controller: ManagerEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManagerEventController],
    }).compile();

    controller = module.get<ManagerEventController>(ManagerEventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
