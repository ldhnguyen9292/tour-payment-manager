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
    app.enableCors({
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true,
    });

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

/**
 * Features:
 * - The app is now using the `cookie-parser`, `express-session`, and `passport` middleware.
 * - The app is now using the `cors` middleware with different configurations based on the environment.
 * - The app is now using the Swagger module to generate API documentation.
 * - API documentation is now available at `/api-docs`.
 *
 * List APIs:
 *  - Auth APIs: Done
 *    + POST /auth/login
 *    + POST /auth/logout
 *    + GET /auth/me
 *    + GET /google
 *    + GET /google/callback
 *    + GET /facebook
 *    + GET /facebook/callback
 *  - User APIs: Done
 *    + POST /users
 *    + PUT /users/:id
 *    + GET /users/reset-password/:email
 *    + PATCH /users/reset-password
 *    + GET /users/team-members
 *    + GET /users/team-members/:id
 *    + POST /users/team-members
 *    + PUT /users/team-members/:id
 *    + DELETE /users/team-members/:id
 *  - Admin APIs: Done
 *    + GET /admin/users
 *    + GET /admin/users/:id
 *    + POST /admin/users
 *    + PUT /admin/users/:id
 *    + DELETE /admin/users/:id
 *    + PUT /admin/restore/users/:id
 *  - Tour APIs: Done
 *    + GET /tours
 *    + GET /tours/:id
 *    + POST /tours
 *    + PUT /tours/:id
 *    + DELETE /tours/:id
 *  - Payment APIs:
 *    + GET /payments
 *    + GET /payments/:id
 *    + POST /payments
 *    + PUT /payments/:id
 *    + DELETE /payments/:id
 *  - Dashboard APIs:
 *    + GET /dashboard
 */
