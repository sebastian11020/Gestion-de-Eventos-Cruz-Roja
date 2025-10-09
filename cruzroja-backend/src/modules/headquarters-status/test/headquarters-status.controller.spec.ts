import { Test, TestingModule } from '@nestjs/testing';
import { HeadquartersStatusController } from '../headquarters-status.controller';

describe('HeadquartersStatusController', () => {
  let controller: HeadquartersStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeadquartersStatusController],
    }).compile();

    controller = module.get<HeadquartersStatusController>(
      HeadquartersStatusController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
