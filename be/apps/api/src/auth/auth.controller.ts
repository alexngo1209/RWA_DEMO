import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyDto } from './dto/verify.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) { }

  @Post('nonce')
  getNonce(@Body('address') address: string) {
    const nonce = this.auth.generateNonce(address);
    return { nonce };
  }

  @Post('verify')
  async verify(@Body() dto: VerifyDto) {
    return this.auth.verify(dto.message, dto.signature);
  }
}