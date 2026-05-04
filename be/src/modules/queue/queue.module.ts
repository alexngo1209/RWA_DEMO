import { Module } from '@nestjs/common';
import { Queue } from 'bullmq';
import Redis from 'ioredis';

@Module({
  providers: [
    {
      provide: 'TX_QUEUE',
      useFactory: () => {
        return new Queue('tx-queue', {
          connection: new Redis(process.env.REDIS_URL),
        });
      },
    },
  ],
  exports: ['TX_QUEUE'],
})
export class QueueModule {}
