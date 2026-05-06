import { Body, Controller, Post } from '@nestjs/common';
import { VaultService } from '@libs/contracts/vault.service';
import { ConfigService } from '@nestjs/config';

@Controller('vault')
export class VaultController {
    constructor(
        private readonly configService: ConfigService,
        private readonly vault: VaultService,
    ) { }

    @Post('withdraw')
    async withdraw(@Body() body: any) {
        const { chainId, amount } = body;

        return this.vault.withdraw(
            chainId,
            this.configService.getOrThrow('adminPrivateKey'),
            amount
        );
    }
}