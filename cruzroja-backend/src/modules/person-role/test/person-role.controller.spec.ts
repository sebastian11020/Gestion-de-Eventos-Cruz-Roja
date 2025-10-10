import { Test, TestingModule } from '@nestjs/testing';
import { PersonRoleController } from '../person-role.controller';

describe('PersonRoleController', () => {
  let controller: PersonRoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonRoleController],
    }).compile();

    controller = module.get<PersonRoleController>(PersonRoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
