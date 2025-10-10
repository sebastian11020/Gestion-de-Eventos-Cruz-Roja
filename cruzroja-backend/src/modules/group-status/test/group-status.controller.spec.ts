import { Test, TestingModule } from '@nestjs/testing';
import { GroupStatusController } from '../group-status.controller';

describe('GroupStatusController', () => {
  let controller: GroupStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupStatusController],
    }).compile();

    controller = module.get<GroupStatusController>(GroupStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
