import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  async register(data: RegisterDto) {
    const userExists = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (userExists) throw new ConflictException('Email já cadastrado');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
      },
    });
    return { id: user.id, email: user.email, name: user.name };
  }

  async login(data: LoginDto) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciais inválidas');

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET não está definida no ambiente!');
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    );
    return { access_token: token };
  }
}
