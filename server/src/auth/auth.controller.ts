import { Controller, Post, Request, Response, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Response() res) {
    if (req.user) {
      req.login(req.user, (err) => {
        if (err) {
          res.status(500).json({ message: 'Error logging in' });
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
        res.status(500).json({ message: 'Error logging out' });
      } else {
        res.status(200).json({ message: 'Logged out successfully' });
      }
    });
  }
}
