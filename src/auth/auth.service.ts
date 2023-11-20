import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Req,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserSignupDto } from './dto/user-signup.dto';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
@Injectable()
export class AuthService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService,
  ) {}

  async signUpUser(signupDto: UserSignupDto) {
    const { email } = signupDto;
    const existingUser = await this.entityManager.findOneBy(User, { email });
    if (existingUser) {
      // todo throw session error
    }

    signupDto.password = await this.hashPassword(signupDto.password);

    let user = new User();
    user = { ...signupDto } as User;
    return await this.entityManager.save(User, user);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.entityManager.findOneBy(User, { email });
    const passwordMatch: boolean = await this.compareHashPassword(
      password,
      user.password,
    );
    if (!passwordMatch)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async login(): Promise<any> {
    return {
      message: 'Login successful',
      statusCode: HttpStatus.OK,
    };
  }

  async logout(@Req() request: Request): Promise<any> {
    const logoutError = await new Promise((resolve) =>
      request.logOut({ keepSessionInfo: false }, (error) => resolve(error)),
    );

    if (logoutError) {
      console.error(logoutError);
      throw new InternalServerErrorException('Could not log out user');
    }

    return {
      logout: true,
    };
  }

  async hashPassword(password: string): Promise<string> {
    const salt = +this.configService.getOrThrow<number>('PASSWORD_HASH_SALT');
    return await bcrypt.hash(password, salt);
  }

  async compareHashPassword(s: string, hash: string): Promise<boolean> {
    return bcrypt.compare(s, hash);
  }

  async getUserByEmail(email: string) {
    return await this.entityManager.findOneBy(User, { email });
  }
}
