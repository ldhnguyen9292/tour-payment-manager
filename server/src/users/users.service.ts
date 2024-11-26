import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

import { ProjectionType } from 'mongoose';
import { SoftDeleteModel } from 'plugins/mongoose';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: SoftDeleteModel<User>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(
    username: string,
    projection?: ProjectionType<User> | null,
  ): Promise<User | undefined> {
    return this.userModel.findOne({ username }, projection).exec();
  }

  async findById(id: string): Promise<User | undefined> {
    return this.userModel.findById(id).exec();
  }

  async create(user: User): Promise<User> {
    // Valid password length, at least 8 characters, at most 20 characters, at least one uppercase letter, at least one lowercase letter, at least one number, at least one special character
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/;
    if (!passwordRegex.test(user.password)) {
      throw new BadRequestException(
        'Password must be at least 8 characters long, at most 20 characters long, contain at least one uppercase letter, contain at least one lowercase letter, contain at least one number, contain at least one special character',
      );
    }

    // Check if username already exists
    const existingUser = await this.userModel.findOne({
      username: user.username,
    });
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async delete(id: string): Promise<User> {
    // Should soft delete instead of hard delete
    return this.userModel.softDelete(id);
  }
}
