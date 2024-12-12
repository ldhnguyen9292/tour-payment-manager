import { Injectable } from '@nestjs/common';

import { User } from 'src/users/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminService {
  constructor(private usersService: UsersService) {}

  async findAllUsers(isDeleted = false) {
    const condition = isDeleted
      ? { deleted: true }
      : { deleted: { $not: { $gt: true } } };
    return this.usersService.find(condition);
  }

  async findUserById(id: string) {
    return this.usersService.findById(id);
  }

  async createNewUser(user: User) {
    return this.usersService.create(user);
  }

  async updateUserById(id: string, user: User) {
    return this.usersService.updateById(id, user);
  }

  async softDeleteById(id: string) {
    return this.usersService.softDelete(id);
  }

  async restoreUserById(id: string) {
    return this.usersService.restore(id);
  }
}
