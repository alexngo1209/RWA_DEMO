import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Block } from '@libs/db/schemas/block.schema';

@Injectable()
export class BlockTrackerService {
    constructor(
        @InjectModel(Block.name)
        private readonly blockModel: Model<Block>
    ) { }

    async saveBlocks(blocks: any[], chainId: number) {
        const ops = blocks.map(b => ({
            updateOne: {
                filter: { chainId, blockNumber: b.number },
                update: {
                    chainId,
                    blockNumber: b.number,
                    blockHash: b.hash,
                    parentHash: b.parentHash
                },
                upsert: true
            }
        }));

        if (ops.length) {
            await this.blockModel.bulkWrite(ops);
        }
    }

    async getBlock(chainId: number, blockNumber: number) {
        return this.blockModel.findOne({ chainId, blockNumber });
    }

    async deleteFromBlock(chainId: number, fromBlock: number) {
        await this.blockModel.deleteMany({
            chainId,
            blockNumber: { $gte: fromBlock }
        });
    }
}