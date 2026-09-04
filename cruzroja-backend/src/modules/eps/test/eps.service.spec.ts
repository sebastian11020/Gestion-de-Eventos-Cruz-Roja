import { Test, TestingModule } from '@nestjs/testing';
import { EpsService } from '../eps.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Eps } from '../entity/eps.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('EpsService', () => {
  let service: EpsService;

  const mockEpsRepository = {
    find: jest.fn(),
    exists: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EpsService,
        { provide: getRepositoryToken(Eps), useValue: mockEpsRepository },
      ],
    }).compile();

    service = module.get<EpsService>(EpsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a Eps if does not exists', async () => {
    const name_eps = 'sanitas';
    mockEpsRepository.exists.mockResolvedValueOnce(false);
    mockEpsRepository.create.mockResolvedValueOnce({
      name: name_eps.trim().toUpperCase(),
    });
    mockEpsRepository.save.mockResolvedValueOnce({
      id: 1,
      name: name_eps.trim().toUpperCase(),
    });
    const result = await service.create({ name: name_eps });
    expect(result).toEqual({
      success: true,
      message: 'Eps creada exitosamente',
    });
  });
  it('should throw ConflictException if EPS already exists', async () => {
    const name_eps = 'sanitas';
    mockEpsRepository.exists.mockResolvedValueOnce(true);
    await expect(service.create({ name: name_eps })).rejects.toThrow(
      new ConflictException({
        success: false,
        message: `Ya existe una EPS con el nombre: ${name_eps}`,
      }),
    );
  });
  it('should throw conflict if no EPS was updated', async () => {
    mockEpsRepository.update.mockResolvedValueOnce({ affected: 0 });
    await expect(service.update(999, { name: 'sanitas' })).rejects.toThrow(
      NotFoundException,
    );
  });
});
