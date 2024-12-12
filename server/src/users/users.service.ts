import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { ProjectionType, RootFilterQuery } from 'mongoose';

import { objectId } from 'src/lib/mongoose';
import { User, UserModel } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: typeof UserModel,
    private configService: ConfigService,
  ) {}

  async find(conditions: RootFilterQuery<User>): Promise<User[]> {
    return this.userModel.find(conditions).exec();
  }

  async findOne(
    conditions: RootFilterQuery<User>,
    projection?: ProjectionType<User> | null,
  ): Promise<User | undefined> {
    return this.userModel.findOne(conditions, projection).exec();
  }

  async findById(id: string): Promise<User | undefined> {
    return this.userModel.findById(objectId(id)).exec();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email, isDeleted: false }).exec();
  }

  async create(user: User): Promise<User> {
    // Valid email
    if (user.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.email)) {
        throw new BadRequestException('Invalid email');
      }
    }

    // Valid password length, at least 8 characters, at most 20 characters, at least one uppercase letter, at least one lowercase letter, at least one number, at least one special character
    if (user.password) {
      const passwordRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/;
      if (!passwordRegex.test(user.password)) {
        throw new BadRequestException(
          'Password must be at least 8 characters long, at most 20 characters long, contain at least one uppercase letter, contain at least one lowercase letter, contain at least one number, contain at least one special character',
        );
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    }

    // Check if username or email already exists
    const condition = user.email
      ? { $or: [{ username: user.username }, { email: user.email }] }
      : { username: user.username };
    const existingUser = await this.userModel.findOne(condition).exec();

    if (existingUser) {
      throw new BadRequestException('Username or email already exists');
    }

    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async createOAuthUser(user: Partial<User>): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async updateById(id: string, user: Partial<User>): Promise<User | null> {
    if (user.email) {
      const existedEmail = await this.userModel.findOne({ email: user.email });

      if (existedEmail) {
        throw new BadRequestException(
          'Email already exists! Please contact Admin to change your email!',
        );
      }
    }

    if (user.username) {
      const existedUsername = await this.userModel.findOne({
        username: user.username,
      });

      if (existedUsername) {
        throw new BadRequestException('Username already exists');
      }
    }

    if (user.password) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    }

    return this.userModel
      .findByIdAndUpdate(objectId(id), user, { new: true })
      .exec();
  }

  async softDelete(id: string): Promise<void> {
    // Cannot delete admin user
    const user = await this.userModel.findById(objectId(id)).exec();
    if (user.isAdmin) {
      throw new BadRequestException('Cannot delete admin user');
    }

    await this.userModel.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.userModel.restore(id);
  }

  async sendEmailToResetPassword(email: string): Promise<void> {
    const existedUser = await this.findByEmail(email);

    if (!existedUser) {
      throw new BadRequestException('User not found!');
    }

    const token = Math.random().toString(36).substring(2, 15);
    existedUser.resetPasswordToken = token;
    await existedUser.save();

    // Send email to reset password
    const resetPasswordLink = `${this.configService.get<string>('FRONTEND_URL') || 'localhost:3000'}/reset-password?token=${token}`;
    console.log('Reset password link:', resetPasswordLink);
  }

  async resetPassword(data: {
    token: string;
    password: string;
  }): Promise<User | null> {
    const existedUser = await this.findOne({
      resetPasswordToken: data.token,
    });

    if (!existedUser) {
      throw new BadRequestException('User not found!');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    existedUser.password = hashedPassword;
    existedUser.resetPasswordToken = undefined;
    return existedUser.save();
  }
}
