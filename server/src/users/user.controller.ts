import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { RequireAdmin } from 'src/auth/require-admin.decorator';
import { User } from './user.schema';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiProperty({
    description: 'User object containing username, email and password',
  })
  @ApiBody({
    schema: {
      example: {
        username: 'newuser',
        email: 'newuser@yopmail.com',
        password: 'Abcde1234@',
      },
    },
  })
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        _id: '60d6b4f4d2f9b9a1e0e5b7e1',
        username: 'newuser',
        email: 'newuser@yopmail.com',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid username, email or password',
  })
  async create(@Body() user: User) {
    return this.usersService.create(user);
  }

  @Get()
  @UseGuards(AuthenticatedGuard)
  @RequireAdmin()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Only available to admin users',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          _id: '60d6b4f4d2f9b9a1e0e5b7e1',
          username: 'newuser',
          email: 'newuser@yopmail.com',
        },
      ],
    },
  })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthenticatedGuard)
  @RequireAdmin()
  @ApiOperation({
    summary: 'Get a user by id',
    description: 'Only available to admin users',
  })
  @ApiResponse({ status: 200, type: User })
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard)
  @RequireAdmin()
  @ApiOperation({
    summary: 'Delete a user by id',
    description: 'Only available to admin users',
  })
  @ApiResponse({ status: 200 })
  async remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
