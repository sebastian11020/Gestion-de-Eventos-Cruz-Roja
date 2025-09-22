import { Test, TestingModule } from '@nestjs/testing';
import { HeadquartersController } from '../headquarters.controller';

describe('HeadquartersController', () => {
  let controller: HeadquartersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeadquartersController],
    }).compile();

    controller = module.get<HeadquartersController>(HeadquartersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
