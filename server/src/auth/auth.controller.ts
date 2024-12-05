import {
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/user.schema';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  private frontendUrl: string;

  constructor(private configService: ConfigService) {
    this.frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({
    schema: { example: { username: 'test', password: 'abcdffewfww@12345' } },
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Logged in successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async login(@Request() req, @Response() res) {
    await this.handleLogin(req, res);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logged out successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async logout(@Request() req, @Response() res) {
    try {
      await new Promise<void>((resolve, reject) => {
        req.logout((err: Error) => {
          if (err) reject(err);
          else resolve();
        });
      });
      res.status(HttpStatus.OK).json({ message: 'Logged out successfully' });
    } catch (_err) {
      throw new InternalServerErrorException('Error logging out');
    }
  }

  @Get('me')
  @ApiOperation({ summary: 'Check authentication status and get user info' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Authenticated',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Not authenticated',
  })
  async checkAuthStatus(@Request() req, @Response() res) {
    if (req.isAuthenticated()) {
      res.status(HttpStatus.OK).json(req.user);
    } else {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Not authenticated' });
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth' })
  async googleAuth() {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Redirect to dashboard',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async googleAuthCallback(@Request() req, @Response() res) {
    await this.handleOAuthCallback(req, res);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  @ApiOperation({ summary: 'Initiate Facebook OAuth' })
  async facebookAuth() {
    // Guard redirects to Facebook
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  @ApiOperation({ summary: 'Facebook OAuth callback' })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Redirect to dashboard',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async facebookAuthCallback(@Request() req, @Response() res) {
    await this.handleOAuthCallback(req, res);
  }

  private async handleLogin(req: any, res: any): Promise<void> {
    if (!req.user) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      return;
    }

    try {
      await new Promise<void>((resolve, reject) => {
        req.login(req.user, (err: Error) => {
          if (err) reject(err);
          else resolve();
        });
      });
      res.status(HttpStatus.OK).json({ message: 'Logged in successfully' });
    } catch (_err) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }
  }

  private async handleOAuthCallback(req: any, res: any): Promise<void> {
    if (!req.user) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      return;
    }

    try {
      await new Promise<void>((resolve, reject) => {
        req.login(req.user, (err: Error) => {
          if (err) reject(err);
          else resolve();
        });
      });
      res.redirect(this.frontendUrl);
    } catch (_err) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }
  }
}
