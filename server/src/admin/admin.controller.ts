import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { RequireAdmin } from 'src/auth/require-admin.decorator';
import { generatePassword } from 'src/lib/randomPass';
import { User } from 'src/users/user.schema';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AuthenticatedGuard)
@RequireAdmin()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  @ApiOperation({
    summary: 'Get all users',
    description: 'Only available to admin users',
  })
  @ApiQuery({ name: 'isDeleted', required: false })
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
  async findAll(@Query('isDeleted') isDeleted?: boolean) {
    return this.adminService.findAllUsers(isDeleted);
  }

  @Get('users/:id')
  @ApiOperation({
    summary: 'Get a user by id',
    description: 'Only available to admin users',
  })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: User })
  async findById(@Param('id') id: string) {
    return this.adminService.findUserById(id);
  }

  @Post('users')
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Only available to admin users',
  })
  @ApiBody({
    schema: { default: { username: 'abc', password: generatePassword() } },
  })
  @ApiResponse({ status: 201, type: User })
  async create(@Body() user: User) {
    return this.adminService.createNewUser(user);
  }

  @Put('users/:id')
  @ApiOperation({
    summary: 'Update a user by id',
    description: 'Only available to admin users',
  })
  @ApiParam({ name: 'id' })
  @ApiBody({
    schema: {
      example: {
        username: 'newuser',
        email: 'newuser@yopmail.com',
        name: 'New User',
        password: generatePassword(),
      },
    },
  })
  @ApiResponse({ status: 200, type: User })
  async update(@Param('id') id: string, @Body() user: User) {
    return this.adminService.updateUserById(id, user);
  }

  @Delete('users/:id')
  @ApiOperation({
    summary: 'Delete a user by id',
    description: 'Only available to admin users',
  })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  async remove(@Param('id') id: string) {
    return this.adminService.deleteUserById(id);
  }

  @Put('restore/users/:id')
  @ApiOperation({
    summary: 'Restore a user by id',
    description: 'Only available to admin users',
  })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: User })
  async restore(@Param('id') id: string) {
    return this.adminService.restoreUserById(id);
  }
}
