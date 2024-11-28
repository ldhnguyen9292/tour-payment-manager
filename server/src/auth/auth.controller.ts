import {
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ schema: { example: { username: 'test', password: '123abc' } } })
  @ApiResponse({ status: 200, description: 'Logged in successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Request() req, @Response() res) {
    if (req.user) {
      req.login(req.user, (err) => {
        if (err) {
          res.status(401).json({ message: 'Unauthorized' });
        } else {
          res.status(200).json({ message: 'Logged in successfully' });
        }
      });
    }
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({ status: 500 })
  async logout(@Request() req, @Response() res) {
    req.logout((err) => {
      if (err) {
        res.status(500).json({ message: err.toString() });
      } else {
        res.status(200).json({ message: 'Logged out successfully' });
      }
    });
  }

  // Google OAuth routes
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Request() req, @Response() res) {
    if (req.user) {
      req.login(req.user, (err) => {
        if (err) {
          res.status(401).json({ message: 'Unauthorized' });
        } else {
          res.status(200).json({ message: 'Logged in successfully' });
        }
      });
    }
  }

  // Facebook OAuth routes
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth() {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthCallback(@Request() req, @Response() res) {
    if (req.user) {
      req.login(req.user, (err) => {
        if (err) {
          res.status(401).json({ message: 'Unauthorized' });
        } else {
          res.status(200).json({ message: 'Logged in successfully' });
        }
      });
    }
  }
}
