import {
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard('local'))
  @Post('login')
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
