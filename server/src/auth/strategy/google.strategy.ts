import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

import { UsersService } from '../../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private usersService: UsersService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const email = profile.emails[0].value;
    const username = profile.displayName;

    let user = await this.usersService.findByEmail(email);

    if (!user) {
      // Create a new user if they don't exist
      user = await this.usersService.createOAuthUser({
        username,
        email,
        provider: 'google',
        providerId: profile.id,
      });
    }

    return user;
  }
}
