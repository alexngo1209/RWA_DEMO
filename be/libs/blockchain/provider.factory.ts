import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonRpcProvider, FallbackProvider } from 'ethers';

@Injectable()
export class ProviderFactory {
  constructor(private readonly configService: ConfigService) {

  }
  private providers = new Map<number, FallbackProvider>();

  get(chainId: number): FallbackProvider {
    if (this.providers.has(chainId)) {
      return this.providers.get(chainId)!;
    }

    const config: Record<number, string[]> = {
      1: this.configService.get('rpcs.1', []) || [],
      56: this.configService.get('rpcs.56', []) || [],
      137: this.configService.get('rpcs.137', []) || [],
    };

    const urls = config[chainId];
    if (!urls) throw new Error('Unsupported chain');

    const providers = urls.map(url => new JsonRpcProvider(url));
    const fallback = new FallbackProvider(providers);

    this.providers.set(chainId, fallback);
    return fallback;
  }
}