import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { Session } from './session';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, Session],
})
export class AuthModule {}
