import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('deve chamar authService.register com os dados corretos', async () => {
      const dto: RegisterDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResult = {
        id: '1',
        name: dto.name,
        email: dto.email,
      };

      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(dto);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('deve chamar authService.login e retornar o token', async () => {
      const dto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResult = {
        access_token: 'jwt_token_mock',
        user: {
          id: '1',
          email: dto.email,
          name: 'Test User',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(dto);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('googleLogin', () => {
    it('deve ser definido (a lógica real é tratada pelo Guard)', async () => {
      const result = await controller.googleLogin();
      expect(result).toBeUndefined();
    });
  });
});
