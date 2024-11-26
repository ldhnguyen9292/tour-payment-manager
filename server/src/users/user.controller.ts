import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { RequireAdmin } from 'src/auth/require-admin.decorator';
import { User } from './user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() user: User) {
    return this.usersService.create(user);
  }

  @Get()
  @UseGuards(AuthenticatedGuard)
  @RequireAdmin()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthenticatedGuard)
  @RequireAdmin()
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard)
  @RequireAdmin()
  async remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
