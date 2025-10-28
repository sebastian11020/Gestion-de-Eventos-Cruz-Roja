import { Test, TestingModule } from '@nestjs/testing';
import { EventAttendanceService } from '../event_attendance.service';

describe('EventAttendanceService', () => {
  let service: EventAttendanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventAttendanceService],
    }).compile();

    service = module.get<EventAttendanceService>(EventAttendanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
