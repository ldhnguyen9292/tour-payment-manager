import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

import { UsersService } from '../../users/users.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private usersService: UsersService) {
    super({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/facebook/callback`,
      scope: ['email'],
      profileFields: ['emails', 'name'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const email = profile.emails[0].value;
    const username = `${profile.name.givenName} ${profile.name.familyName}`;

    let user = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.createOAuthUser({
        username,
        email,
        provider: 'facebook',
        providerId: profile.id,
      });
    }

    return user;
  }
}
