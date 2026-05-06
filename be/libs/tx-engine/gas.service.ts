import { Injectable } from '@nestjs/common';
import { ProviderFactory } from '@libs/blockchain/provider.factory';

@Injectable()
export class GasService {
    constructor(private readonly providerFactory: ProviderFactory) { }

    async getFees(chainId: number) {
        const provider = this.providerFactory.get(chainId);

        const feeData = await provider.getFeeData();

        return {
            maxFeePerGas: feeData.maxFeePerGas! * 12n / 10n,
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas! * 12n / 10n
        };
    }
}