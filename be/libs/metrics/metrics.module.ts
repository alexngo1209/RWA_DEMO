import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { ConfigModule } from '@libs/config/config.module';;

@Module({
    imports: [ConfigModule],
    providers: [MetricsService],
    controllers: [MetricsController],
    exports: [MetricsService]
})
export class MetricsModule { }