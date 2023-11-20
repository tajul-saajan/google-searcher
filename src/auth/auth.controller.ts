import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserSignupDto } from './dto/user-signup.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from '../guards/local.guard';
import { GetAuthUser } from '../decorators/get-auth-user';
import * as ExpressSession from 'express-session';
import { IsAuthenticatedGuard } from '../guards/is-authenticated';
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}
  @Render('login')
  @Get('login')
  login() {
    return;
  }

  @UseGuards(LocalGuard)
  @Post('login')
  loginUser(@Req() request: Request): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    console.log(request.user);
    return this.service.login();
  }
  @Render('signup')
  @Get('signup')
  signUp() {
    return;
  }

  @Post('signup')
  async createUser(@Body() signupDto: UserSignupDto) {
    return await this.service.signUpUser(signupDto);
  }

  @Get('logout')
  async logout(@Req() request: Request, @Res() r: Response): Promise<any> {
    await this.service.logout(request);
    r.render('login');
  }

  @UseGuards(IsAuthenticatedGuard)
  @Get('profile')
  async profile(@Session() s: ExpressSession) {
    console.log('kkop', s);
    return s;
  }
}
