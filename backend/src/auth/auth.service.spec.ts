import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const registerDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const hashedPassword = 'hashed_password';
      const createdUser = {
        id: '1',
        email: registerDto.email,
        name: registerDto.name,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (prisma.user.create as jest.Mock).mockResolvedValue(createdUser);

      const result = await service.register(registerDto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(result).toEqual({
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
      });
    });

    it('deve lançar ConflictException se email já existe', async () => {
      const registerDto = {
        email: 'existing@example.com',
        name: 'Test User',
        password: 'password123',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        email: registerDto.email,
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashed_password',
        name: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      process.env.JWT_SECRET = 'segredo';

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('token_jwt');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('access_token', 'token_jwt');
    });

    it('deve lançar UnauthorizedException se usuário não existe', async () => {
      const loginDto = { email: 'wrong@example.com', password: 'password123' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
