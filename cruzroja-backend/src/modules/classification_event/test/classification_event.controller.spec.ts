import { Test, TestingModule } from '@nestjs/testing';
import { ClassificationEventController } from '../classification_event.controller';

describe('ClassificationEventController', () => {
  let controller: ClassificationEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassificationEventController],
    }).compile();

    controller = module.get<ClassificationEventController>(
      ClassificationEventController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
