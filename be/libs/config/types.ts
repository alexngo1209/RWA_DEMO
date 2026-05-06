export enum AppMode {
    production = 'production',
    maintain = 'maintain',
    development = 'development',
}

export class Configuration {
    name: string;
    mode: AppMode;
    port: number;
    version: {
        code: number;
        name: string;
        path: string;
    };
    timezone: string;
    mongoUri: string;
    redis: {
        host: string;
        port: number;
    };
    rpcs: {
        [chain: number]: string[],
    };
    contracts: {
        [chain: number]: string;
    };
}

export const configuration = (): Configuration => {
    return {
        name: process.env.NAME || '',
        mode: (process.env.MODE as AppMode) || AppMode.production,
        port: parseInt(process.env.PORT) || 3000,
        version: {
            code: parseInt(process.env.VERSION_CODE) || 1,
            name: process.env.VERSION_NAME || '1.0.0',
            path: process.env.VERSION_PATH || 'v1',
        },
        timezone:
            process.env.TIMEZONE ||
            Intl.DateTimeFormat().resolvedOptions().timeZone ||
            'UTC',
        mongoUri: process.env.MONGO_URI || '',
        redis: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT) || 6379,
        },
        rpcs: {
            1: [process.env.ETH_RPC_1, process.env.ETH_RPC_2].filter((rpc) => rpc),
            56: [process.env.BSC_RPC_1, process.env.BSC_RPC_2].filter((rpc) => rpc),
            137: [process.env.POLYGON_RPC_1, process.env.POLYGON_RPC_2].filter((rpc) => rpc),
        },
        contracts: {
            1: process.env.ETH_CONTRACT || '',
            56: process.env.BSC_CONTRACT || '',
            137: process.env.POLYGON_CONTRACT || '',
        },
    };
};
