import { Test, TestingModule } from '@nestjs/testing';
import { PersonRoleService } from '../person-role.service';

describe('PersonRoleService', () => {
  let service: PersonRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonRoleService],
    }).compile();

    service = module.get<PersonRoleService>(PersonRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
