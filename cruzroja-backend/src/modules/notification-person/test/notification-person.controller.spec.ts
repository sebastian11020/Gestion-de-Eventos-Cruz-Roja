import { Test, TestingModule } from '@nestjs/testing';
import { NotificationPersonController } from '../notification-person.controller';

describe('NotificationPersonController', () => {
  let controller: NotificationPersonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationPersonController],
    }).compile();

    controller = module.get<NotificationPersonController>(
      NotificationPersonController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
