import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Block, BlockSchema } from '@libs/db/schemas/block.schema';
import { Event, EventSchema } from '@libs/db/schemas/event.schema';
import { ReorgService } from './reorg.service';
import { RollbackService } from './rollback.service';
import { BlockTrackerService } from './block-tracker.service';
import { ConfigModule } from '@libs/config/config.module';

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forFeature([
            { name: Block.name, schema: BlockSchema },
            { name: Event.name, schema: EventSchema }
        ])
    ],
    providers: [
        ReorgService,
        RollbackService,
        BlockTrackerService
    ],
    exports: [ReorgService]
})
export class ReorgModule { }