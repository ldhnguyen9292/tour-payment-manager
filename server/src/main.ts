import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000, // 1 hour
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  if (process.env.NODE_ENV === 'production') {
    app.enableCors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    });
  } else {
    // Swagger configuration
    const config = new DocumentBuilder()
      .setTitle('Tour Payment Manager API')
      .setDescription(
        'The API documentation for the Tour Payment Manager application',
      )
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document); // Swagger UI will be hosted at /api-docs
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
