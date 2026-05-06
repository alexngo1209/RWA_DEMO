import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { SiweMessage } from 'siwe';

@Injectable()
export class AuthService {
  private nonces = new Map<string, string>();

  generateNonce(address: string) {
    const nonce = randomBytes(16).toString('hex');
    this.nonces.set(address, nonce);
    return nonce;
  }

  async verify(message: string, signature: string) {
    const siwe = new SiweMessage(message);
    const result = await siwe.verify({ signature });

    const expected = this.nonces.get(result.data.address);

    if (!expected || expected !== result.data.nonce) {
      throw new Error('Invalid nonce');
    }

    this.nonces.delete(result.data.address);

    return {
      address: result.data.address
    };
  }
}