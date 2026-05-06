import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';
import { configuration, Configuration } from './types';

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            load: [configuration]
        })
    ],
    providers: [
        {
            provide: 'CONFIG',
            useFactory: (configService: ConfigService) => {
                return configService.get<Configuration>('config');
            },
            inject: [ConfigService]
        }
    ],
    exports: ['CONFIG']
})
export class ConfigModule { }