import { Test, TestingModule } from '@nestjs/testing';
import { EventQuotaController } from '../event-quota.controller';

describe('EventQuotaController', () => {
  let controller: EventQuotaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventQuotaController],
    }).compile();

    controller = module.get<EventQuotaController>(EventQuotaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
