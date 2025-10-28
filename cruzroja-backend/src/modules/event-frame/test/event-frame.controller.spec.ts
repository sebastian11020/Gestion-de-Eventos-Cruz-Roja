import { Test, TestingModule } from '@nestjs/testing';
import { EventFrameController } from '../event-frame.controller';

describe('EventFrameController', () => {
  let controller: EventFrameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventFrameController],
    }).compile();

    controller = module.get<EventFrameController>(EventFrameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
