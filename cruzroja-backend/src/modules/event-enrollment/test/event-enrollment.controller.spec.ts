import { Test, TestingModule } from '@nestjs/testing';
import { EventEnrollmentController } from '../event-enrollment.controller';

describe('EventEnrollmentController', () => {
  let controller: EventEnrollmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventEnrollmentController],
    }).compile();

    controller = module.get<EventEnrollmentController>(
      EventEnrollmentController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
