import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { User } from './user.schema';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Users API
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
}
