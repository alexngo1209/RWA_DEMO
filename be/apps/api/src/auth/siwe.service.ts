import { Injectable } from '@nestjs/common';
import { SiweMessage } from 'siwe';

@Injectable()
export class SiweService {
    generateNonce() {
        return Math.random().toString(36).substring(2);
    }

    async verify(message: string, signature: string) {
        const siwe = new SiweMessage(message);
        return await siwe.verify({ signature });
    }
}