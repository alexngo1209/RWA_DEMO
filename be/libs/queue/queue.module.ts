import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'redis',
        port: 6379
      }
    }),
    BullModule.registerQueue({
      name: 'default'
    })
  ],
  providers: [QueueService],
  exports: [QueueService, BullModule]
})
export class QueueModule { }