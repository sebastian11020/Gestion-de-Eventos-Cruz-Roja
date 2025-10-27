import { Test, TestingModule } from '@nestjs/testing';
import { EventAttendanceController } from '../event_attendance.controller';

describe('EventAttendanceController', () => {
  let controller: EventAttendanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventAttendanceController],
    }).compile();

    controller = module.get<EventAttendanceController>(
      EventAttendanceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
