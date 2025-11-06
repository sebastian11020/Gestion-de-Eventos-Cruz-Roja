import { Test, TestingModule } from '@nestjs/testing';
import { NotificationPersonService } from '../notification-person.service';

describe('NotificationPersonService', () => {
  let service: NotificationPersonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationPersonService],
    }).compile();

    service = module.get<NotificationPersonService>(NotificationPersonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
