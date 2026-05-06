import { TransactionRequest } from 'ethers';

export interface SendTxInput {
    chainId: number;
    tx: TransactionRequest;
    signerPrivateKey: string;
}