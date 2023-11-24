import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Session } from 'express-session';
import { ConfigService } from '@nestjs/config';
import { EntityManager } from 'typeorm';

describe('AuthService', () => {
  const mockEntityManager = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  const mockConfigService = {
    getOrThrow: jest.fn(),
  };

  let service: AuthService;
  let entityManager: EntityManager;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    entityManager = module.get<EntityManager>(EntityManager);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUpUser', () => {
    const dto = {
      email: 'aa@bb.com',
      name: 'as',
      password: 'pass',
    };
    const s = {} as Session;

    it('should not sign up user that exits', async () => {
      jest.spyOn(entityManager, 'findOneBy').mockResolvedValue({
        id: 1,
      });

      const res = await service.signUpUser(dto, s);

      expect(entityManager.findOneBy).toBeCalled();

      expect(res).toEqual({
        success: false,
        error: 'email already exists',
      });
    });

    it('should sign up user when user does not exists already', async () => {
      jest.spyOn(entityManager, 'findOneBy').mockResolvedValue(null);
      // @ts-ignore
      jest.spyOn(configService, 'getOrThrow').mockResolvedValue('salt');
      jest.spyOn(entityManager, 'save').mockResolvedValue(dto);
      jest.mock('bcrypt', () => ({
        hash: jest.fn(),
        compare: jest.fn(),
      }));

      const res = await service.signUpUser(dto, s);
      expect(mockConfigService.getOrThrow).toBeCalled();
      expect(res).toEqual({
        success: true,
        data: dto,
      });
    });
  });

  describe('validateUser', () => {
    const user = {
      id: 1,
      name: 'okay',
      password: 'aa',
    };

    it('should throw exception if credential is invalid', async () => {
      jest.spyOn(entityManager, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(service, 'compareHashPassword').mockResolvedValue(false);
      await expect(service.validateUser('a@b.com', 'aac')).rejects.toThrow();
    });

    it('should return user if credential is valid', async () => {
      jest.spyOn(entityManager, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(service, 'compareHashPassword').mockResolvedValue(true);
      const u = await service.validateUser('a@b.com', 'aa');
      const { password, ...expected } = user;
      expect(u).toEqual(expected);
    });
  });
});
