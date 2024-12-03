import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model } from 'mongoose';
import * as passport from 'passport';
import * as request from 'supertest';

import { AuthModule } from 'src/auth/auth.module';
import { TeamMembersModule } from 'src/team-members/team-members.module';
import { User } from 'src/users/user.schema';
import { UsersModule } from 'src/users/users.module';

function generatePassword(
  length = 20,
  characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$',
) {
  return Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map((x) => characters[x % characters.length])
    .join('');
}

describe('AppController', () => {
  const password = generatePassword();
  let app: INestApplication;
  let userModel: Model<User>;
  let mongoServer: MongoMemoryServer;
  let agent;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => ({ MONGODB_URI: uri, NODE_ENV: 'test' })],
        }),
        MongooseModule.forRootAsync({
          useFactory: async (configService: ConfigService) => ({
            uri: configService.get<string>('MONGODB_URI'),
          }),
          inject: [ConfigService],
        }),
        AuthModule,
        UsersModule,
        TeamMembersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.use(cookieParser());
    app.use(
      session({
        secret: 'test',
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 3600000, // 1 hour
          secure: false,
          httpOnly: true,
          sameSite: 'lax',
        },
      }),
    );
    app.use(passport.initialize());
    app.use(passport.session());

    await app.init();

    userModel = app.get<Model<User>>('UserModel');
    agent = request.agent(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await userModel.deleteMany({});
    await userModel.create({
      username: 'admin',
      password: await bcrypt.hash(password, 10),
      email: 'admin@admin.com',
      isAdmin: true,
    });
  });

  describe('AuthController', () => {
    it('should log in and then log out successfully with session', async () => {
      const loginResponse = await agent
        .post('/auth/login')
        .send({ username: 'admin', password })
        .expect(200);
      expect(loginResponse.body.message).toBe('Logged in successfully');

      const logoutResponse = await agent.post('/auth/logout').expect(200);
      expect(logoutResponse.body.message).toBe('Logged out successfully');
    });

    it('should fail to log in with invalid user', async () => {
      const response = await agent
        .post('/auth/login')
        .send({ username: 'invaliduser', password: 'wrongpassword' })
        .expect(401);

      expect(response.body.message).toBe('User not found');
    });

    it('should fail to log in with invalid password', async () => {
      const response = await agent
        .post('/auth/login')
        .send({ username: 'admin', password: 'wrongpassword' })
        .expect(401);

      expect(response.body.message).toBe('Invalid password');
    });

    it('should log in by Google OAuth', async () => {
      const response = await agent.get('/auth/google').expect(302);
      expect(response.header.location).toContain('accounts.google.com');
    });

    it('should log in by Facebook OAuth', async () => {
      const response = await agent.get('/auth/facebook').expect(302);
      expect(response.header.location).toContain('facebook.com');
    });
  });

  describe('UsersController', () => {
    it('should create a new user', async () => {
      await agent
        .post('/users')
        .send({
          username: 'newuser',
          email: 'newuser@yopmail.com',
          password: generatePassword(),
        })
        .expect(201);
    });

    it('should not create a new user with invalid password', async () => {
      await agent
        .post('/users')
        .send({
          username: 'newuser1',
          email: 'newuser1@yopmail.com',
          password: 'invalidpassword',
        })
        .expect(400);
    });

    it('should not create a new user with invalid email', async () => {
      await agent
        .post('/users')
        .send({
          username: 'newuser2',
          email: 'invalidemail',
          password: generatePassword(),
        })
        .expect(400);
    });

    it('should not create a new user with existing username', async () => {
      await agent
        .post('/users')
        .send({
          username: 'admin',
          email: 'admin@admin.com',
          password: generatePassword(),
        })
        .expect(400);
    });

    it('should return all users', async () => {
      await agent
        .post('/auth/login')
        .send({ username: 'admin', password })
        .expect(200);

      await agent.get('/users').expect(200);
    });

    it('should return a user by id', async () => {
      const user = await userModel.findOne({ username: 'admin' });
      await agent.get(`/users/${user._id}`).expect(200);
    });

    it('should not delete admin user', async () => {
      const user = await userModel.findOne({ username: 'admin' });
      await agent.delete(`/users/${user._id}`).expect(400);

      // logout after deleting user
      await agent.post('/auth/logout').expect(200);
    });
  });
});
