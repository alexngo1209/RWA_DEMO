import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyDto } from './dto/verify.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) { }

  @Post('nonce')
  nonce(@Body('address') address: string) {
    return this.auth.getNonce(address);
  }

  @Post('verify')
  verify(@Body() body: VerifyDto) {
    return this.auth.verify(body.message, body.signature);
  }
}