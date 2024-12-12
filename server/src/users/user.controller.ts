import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { generatePassword } from 'src/lib/randomPass';
import { TeamMembersService } from './team-members.service';
import { User } from './user.schema';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private teamMembersService: TeamMembersService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'User object containing username, email and password',
  })
  @ApiBody({ type: User })
  @ApiResponse({
    status: 201,
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid username, email or password',
  })
  async create(@Body() user: User) {
    return this.usersService.create(user);
  }

  @Put(':id')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: 'Update user info',
    description: 'Update user info',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '60d6b4f4d2f9b9a1e0e5b7e1',
  })
  @ApiBody({ type: User })
  @ApiResponse({
    status: 200,
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid username, email',
  })
  async updateUserInfo(@Param() id: string, @Body() user: User) {
    return this.usersService.updateById(id, user);
  }

  @Get('reset-password/:email')
  @ApiOperation({
    summary: 'Send email to reset password',
    description: 'Send email to reset password',
  })
  @ApiParam({
    name: 'email',
    description: 'User email',
    example: 'newuser@yopmail.com',
  })
  @ApiResponse({
    status: 200,
    description: 'Email sent successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid email',
  })
  async sendEmailToResetPassword(@Param() email: string) {
    return this.usersService.sendEmailToResetPassword(email);
  }

  @Patch('reset-password')
  @ApiOperation({
    summary: 'Reset password',
    description: 'Reset password',
  })
  @ApiBody({
    schema: {
      example: {
        token: '',
        password: generatePassword(),
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid token or password',
  })
  async resetPassword(@Body() data: { token: string; password: string }) {
    return this.usersService.resetPassword(data);
  }

  // Team members APIs
  @Get('team-members')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: 'Get team members',
    description: 'Get team members',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        teamMembers: [{ _id: '60d6b4f4d2f9b9a1e0e5b7e1', username: 'newuser' }],
      },
    },
  })
  async getTeamMembers(@Req() req) {
    const user = req.user as User;
    return this.teamMembersService.findAll(user._id.toString());
  }

  @Get('team-members/:id')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: 'Get team member',
    description: 'Get team member',
  })
  @ApiParam({
    name: 'id',
    description: 'Team member ID',
    example: '60d6b4f4d2f9b9a1e0e5b7e1',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        teamMembers: [{ _id: '60d6b4f4d2f9b9a1e0e5b7e1', username: 'newuser' }],
      },
    },
  })
  async getTeamMember(@Req() req, @Param() id: string) {
    const user = req.user as User;
    return this.teamMembersService.findOne(user._id.toString(), id);
  }

  @Post('team-members')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: 'Add team member',
    description: 'Add team member',
  })
  @ApiBody({
    schema: {
      oneOf: [
        { example: { id: '60d6b4f4d2f9b9a1e0e5b7e1' } },
        { example: { username: 'newuser' } },
      ],
    },
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        teamMembers: [{ _id: '60d6b4f4d2f9b9a1e0e5b7e1', username: 'newuser' }],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid team member ID',
  })
  async addTeamMember(
    @Req() req,
    @Body() member: { id?: string; username?: string },
  ) {
    const user = req.user as User;
    return this.teamMembersService.create(user._id.toString(), member);
  }

  @Put('team-members/:id')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: 'Update team member',
    description: 'Update team member',
  })
  @ApiParam({
    name: 'id',
    description: 'Team member ID',
    example: '60d6b4f4d2f9b9a1e0e5b7e1',
  })
  @ApiBody({
    schema: {
      example: {
        username: 'newuser',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Team member updated successfully',
  })
  async updateTeamMember(
    @Req() req,
    @Param() id: string,
    @Body() member: { username?: string },
  ) {
    const user = req.user as User;
    return this.teamMembersService.update(user._id.toString(), id, member);
  }

  @Delete('team-members/:id')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: 'Remove team member',
    description: 'Remove team member',
  })
  @ApiParam({
    name: 'id',
    description: 'Team member ID',
    example: '60d6b4f4d2f9b9a1e0e5b7e1',
  })
  @ApiResponse({
    status: 200,
    description: 'Team member removed successfully',
  })
  async removeTeamMember(@Req() req, @Param() id: string) {
    const user = req.user as User;
    return this.teamMembersService.remove(user._id.toString(), id);
  }
}
