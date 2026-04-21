"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('database', () => ({
    type: 'mssql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '1433', 10),
    username: process.env.DB_USERNAME || 'sa',
    password: process.env.DB_PASSWORD,
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
}));
//# sourceMappingURL=database.config.js.map