import { Test, TestingModule } from '@nestjs/testing';
import { EventStatusController } from '../event-status.controller';

describe('EventStatusController', () => {
  let controller: EventStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventStatusController],
    }).compile();

    controller = module.get<EventStatusController>(EventStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
