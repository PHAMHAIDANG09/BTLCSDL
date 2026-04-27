import { registerAs } from '@nestjs/config/dist';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'mssql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt((process.env.DB_PORT as string) || '1433', 10),
    username: process.env.DB_USERNAME || 'sa',
    password: process.env.DB_PASSWORD || 'Dang@12345',
    database: process.env.DB_DATABASE || 'NextHR',
    extra: {
      trustServerCertificate: true,
    },
    autoLoadEntities: true,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  }),
);
