import { Controller, Get, Render } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Render('login')
  @Get('login')
  login() {
    return { a: 'ok' };
  }
}
