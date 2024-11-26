import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from '../users/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findOne(username, {
      password: 1,
      username: 1,
      isAdmin: 1,
    });

    // Compare the password with the hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (user && isValidPassword) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }
}
