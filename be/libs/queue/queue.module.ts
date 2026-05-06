import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue.service';
import { ConfigModule } from '@libs/config/config.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port')
        }
      })
    }),
    BullModule.registerQueue({
      name: 'default'
    })
  ],
  providers: [QueueService],
  exports: [QueueService, BullModule]
})
export class QueueModule { }