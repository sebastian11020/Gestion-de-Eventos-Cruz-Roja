import { Test, TestingModule } from '@nestjs/testing';
import { GroupHeadquartersController } from '../group-headquarters.controller';

describe('GroupHeadquartersController', () => {
  let controller: GroupHeadquartersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupHeadquartersController],
    }).compile();

    controller = module.get<GroupHeadquartersController>(
      GroupHeadquartersController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
