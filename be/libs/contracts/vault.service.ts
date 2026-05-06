import { Injectable } from '@nestjs/common';
import { Contract, Wallet, parseEther } from 'ethers';
import { ProviderFactory } from '@libs/blockchain/provider.factory';
import { TxService } from '@libs/tx-engine/tx.service';
import { VAULT_ABI } from './abi/vault.abi';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VaultService {
    constructor(
        private readonly configService: ConfigService,
        private readonly providerFactory: ProviderFactory,
        private readonly txService: TxService
    ) { }

    private getContract(chainId: number, signer?: Wallet) {
        const address = this.getAddress(chainId);
        const provider = this.providerFactory.get(chainId);

        return new Contract(
            address,
            VAULT_ABI,
            signer || provider
        );
    }

    private getAddress(chainId: number): string {
        const vaults: Record<number, string> = this.configService.get('vaults') || {};
        return vaults[chainId];
    }

    async deposit(chainId: number, privateKey: string, amount: string, orderId: string) {
        const contract = this.getContract(chainId);

        const tx = await contract.deposit.populateTransaction({
            value: parseEther(amount),
            args: [orderId],
        });

        return this.txService.send({
            chainId,
            tx,
            signerPrivateKey: privateKey
        });
    }

    async withdraw(chainId: number, privateKey: string, amount: string) {
        const contract = this.getContract(chainId);

        const tx = await contract.withdraw.populateTransaction(
            parseEther(amount)
        );

        return this.txService.send({
            chainId,
            tx,
            signerPrivateKey: privateKey
        });
    }
}