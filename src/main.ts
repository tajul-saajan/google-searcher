import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as session from 'express-session';
import * as passport from 'passport';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
import * as handlebars from 'express-handlebars';
// @ts-ignore
import * as flash from 'connect-flash';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'resources/views'));
  app.setViewEngine('hbs');
  app.engine(
    'handlebars',
    handlebars.engine({
      layoutsDir: __dirname + 'resources/layouts',
      extname: 'hbs',
      partialsDir: __dirname + '/views/partials/',
    }),
  );
  app.use(
    session({
      secret: 'asfhdslk',
      resave: true,
      saveUninitialized: false,
      cookie: { maxAge: 600000000 },
    }),
  );
  app.use('/public', express.static(join(__dirname, '..', 'public')));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3010);
}
bootstrap();
