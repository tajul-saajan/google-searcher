import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetAuthUser = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    // @ts-ignore
    const user: Partial<User> = request.session?.passport?.user;
    console.log('ppp');
    return user;

    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    //
    // if (data) {
    //   return request.user[data];
    // }
  },
);
