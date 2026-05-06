import { Injectable } from '@nestjs/common';
import { Interface, Log } from 'ethers';
import { VAULT_ABI } from './abi/vault.abi';

@Injectable()
export class DecoderService {
    private iface = new Interface(VAULT_ABI);

    decode(log: Log) {
        try {
            const parsed = this.iface.parseLog(log);

            return {
                name: parsed.name,
                args: parsed.args
            };
        } catch {
            return null;
        }
    }
}