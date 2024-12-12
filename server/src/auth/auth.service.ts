import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { User } from '../users/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<User> {
    // search username or email
    const user = await this.usersService.findOne(
      { $or: [{ username }, { email: username }], isDeleted: false },
      {
        password: 1,
        username: 1,
        email: 1,
        isAdmin: 1,
      },
    );

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Should remove password from the user object before returning
    delete user.password;
    return user;
  }
}
