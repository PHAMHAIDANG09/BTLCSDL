import { registerAs } from '@nestjs/config';

export default registerAs('controlApi', () => ({
  baseUrl: process.env.CONTROL_API_BASE_URL || 'http://localhost:3001',
  timeout: parseInt(process.env.CONTROL_API_TIMEOUT || '5000', 10),
}));