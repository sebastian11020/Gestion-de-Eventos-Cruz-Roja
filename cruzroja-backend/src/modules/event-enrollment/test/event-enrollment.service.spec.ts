import { Test, TestingModule } from '@nestjs/testing';
import { EventEnrollmentService } from '../event-enrollment.service';

describe('EventEnrollmentService', () => {
  let service: EventEnrollmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventEnrollmentService],
    }).compile();

    service = module.get<EventEnrollmentService>(EventEnrollmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
