import { Injectable, Logger } from '@nestjs/common';
import { Wallet } from 'ethers';
import { ProviderFactory } from '@libs/blockchain/provider.factory';
import { NonceService } from './nonce.service';
import { GasService } from './gas.service';
import { TxRetryService } from './tx-retry.service';
import { SendTxInput } from './types';

@Injectable()
export class TxService {
    private readonly logger = new Logger(TxService.name);

    constructor(
        private readonly providerFactory: ProviderFactory,
        private readonly nonceService: NonceService,
        private readonly gasService: GasService,
        private readonly retryService: TxRetryService
    ) { }

    async send(input: SendTxInput) {
        const { chainId, tx, signerPrivateKey } = input;

        const provider = this.providerFactory.get(chainId);
        const wallet = new Wallet(signerPrivateKey, provider);

        return this.retryService.retry(async () => {
            const nonce = await this.nonceService.getNonce(chainId, wallet.address);
            const fees = await this.gasService.getFees(chainId);

            const populated = {
                ...tx,
                nonce,
                ...fees
            };

            try {
                const response = await wallet.sendTransaction(populated);

                this.logger.log(`TX sent: ${response.hash}`);

                const receipt = await response.wait();

                if (receipt?.status !== 1) {
                    throw new Error('TX failed on-chain');
                }

                return receipt;
            } catch (err: any) {
                await this.handleError(err, chainId, wallet.address);
                throw err;
            }
        });
    }

    private async handleError(err: any, chainId: number, address: string) {
        const msg = err.message || '';

        if (msg.includes('nonce too low')) {
            this.logger.warn('Reset nonce (too low)');
            await this.nonceService.reset(chainId, address);
        }

        if (msg.includes('replacement fee too low')) {
            this.logger.warn('Gas bump needed');
        }

        if (msg.includes('already known')) {
            this.logger.warn('Duplicate tx');
        }
    }
}