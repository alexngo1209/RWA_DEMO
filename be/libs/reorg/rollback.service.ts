import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from '@libs/db/schemas/event.schema';
import { BlockTrackerService } from './block-tracker.service';

@Injectable()
export class RollbackService {
    private readonly logger = new Logger(RollbackService.name);

    constructor(
        @InjectModel(Event.name)
        private readonly eventModel: Model<Event>,
        private readonly blockTracker: BlockTrackerService
    ) { }

    async rollback(chainId: number, fromBlock: number) {
        this.logger.warn(`REORG DETECTED → rollback from block ${fromBlock}`);

        await this.eventModel.deleteMany({
            chainId,
            blockNumber: { $gte: fromBlock }
        });

        await this.blockTracker.deleteFromBlock(chainId, fromBlock);

        // TODO: rollback business state (orders)
    }
}