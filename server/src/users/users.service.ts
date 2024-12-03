import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { ProjectionType, RootFilterQuery } from 'mongoose';

import { SoftDeleteModel } from 'src/plugins/mongoose';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: SoftDeleteModel<User>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(
    conditions: RootFilterQuery<User>,
    projection?: ProjectionType<User> | null,
  ): Promise<User | undefined> {
    return this.userModel.findOne(conditions, projection).exec();
  }

  async findByEmail(
    email: string,
    projection?: ProjectionType<User> | null,
  ): Promise<User | undefined> {
    return this.userModel.findOne({ email }).select(projection).exec();
  }

  async findById(id: string): Promise<User | undefined> {
    return this.userModel.findById(id).exec();
  }

  async create(user: User): Promise<User> {
    // Valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      throw new BadRequestException('Invalid email');
    }

    // Valid password length, at least 8 characters, at most 20 characters, at least one uppercase letter, at least one lowercase letter, at least one number, at least one special character
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/;
    if (!passwordRegex.test(user.password)) {
      throw new BadRequestException(
        'Password must be at least 8 characters long, at most 20 characters long, contain at least one uppercase letter, contain at least one lowercase letter, contain at least one number, contain at least one special character',
      );
    }

    // Check if username or email already exists
    const existingUser = await this.userModel
      .findOne({ $or: [{ username: user.username }, { email: user.email }] })
      .exec();

    if (existingUser) {
      throw new BadRequestException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async createOAuthUser(user: Partial<User>): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async delete(id: string): Promise<User> {
    // Cannot delete admin user
    const user = await this.userModel.findById(id).exec();
    if (user.isAdmin) {
      throw new BadRequestException('Cannot delete admin user');
    }

    // Should soft delete instead of hard delete
    return this.userModel.softDelete(id);
  }
}
