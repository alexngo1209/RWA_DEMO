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
  rpcUrl: string;
  privateKey: string;
  contractAddress: string;
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
    rpcUrl: process.env.RPC_URL || '',
    privateKey: process.env.PRIVATE_KEY || '',
    contractAddress: process.env.CONTRACT_ADDRESS || '',
  };
};
