import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class IsAuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest() as Request;
    const response = ctx.getResponse() as Response;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const user = request?.session?.passport?.user;

    if (!user) {
      response.redirect('/auth/login');
    }

    return request.isAuthenticated();
  }
}
