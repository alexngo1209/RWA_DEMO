import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { OrderModule } from './modules/order/order.module';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/rwa'),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    OrderModule,
  ],
})
export class AppModule {}
