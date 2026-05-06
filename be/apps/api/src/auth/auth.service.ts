import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SiweService } from './siwe.service';
import { UserService } from '../user/user.service';
import { JWTPayload } from './type';

@Injectable()
export class AuthService {
  constructor(
    private readonly siwe: SiweService,
    private readonly users: UserService,
    private readonly jwt: JwtService,
  ) { }

  async getNonce(address: string) {
    const nonce = this.siwe.generateNonce();

    await this.users.createOrUpdateNonce(address, nonce);

    return { nonce };
  }

  async verify(message: string, signature: string) {
    const result = await this.siwe.verify(message, signature);

    const user = await this.users.findByAddress(result.data.address);

    if (!user || user.nonce !== result.data.nonce) {
      throw new UnauthorizedException('Invalid nonce');
    }

    await this.users.clearNonce(result.data.address);

    const payload: JWTPayload = {
      address: user.address,
      userId: user._id.toString(),
    };

    const token = this.jwt.sign(payload);

    return {
      accessToken: token,
      user: {
        id: user._id,
        address: user.address,
      },
    };
  }
}