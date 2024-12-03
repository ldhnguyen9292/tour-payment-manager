import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

export interface Payload {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  name?: string;
  avatarUrl?: string;
}

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(
    user: Payload,
    done: (err: Error | null, user: Payload | null) => void,
  ): void {
    try {
      done(null, {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        name: user.name,
        avatarUrl: user.avatarUrl,
      });
    } catch (error) {
      done(error as Error, null);
    }
  }

  deserializeUser(
    payload: Payload,
    done: (err: Error | null, payload: Payload | null) => void,
  ): void {
    try {
      done(null, payload);
    } catch (error) {
      done(error as Error, null);
    }
  }
}
