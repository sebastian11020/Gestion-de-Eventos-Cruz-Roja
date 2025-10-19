import { Test, TestingModule } from '@nestjs/testing';
import { ClassificationEventService } from '../classification_event.service';

describe('ClassificationEventService', () => {
  let service: ClassificationEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassificationEventService],
    }).compile();

    service = module.get<ClassificationEventService>(
      ClassificationEventService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
