import { InternalServerErrorException } from '@nestjs/common';

export default () => ({
  DATABASE_URL: getEnv('DATABASE_URL'),
  PORT: getEnv('PORT', '8080'),
  NODE_ENV: getEnv('NODE_ENV', 'development'),

  // Clients
  DASHBOARD_ORIGIN: getEnv('DASHBOARD_ORIGIN'),
  CLIENT_ORIGIN: getEnv('CLIENT_ORIGIN'),
});

const getEnv = (key: string, defaultValue: string = '') => {
  const value = process.env[key];
  if (value !== undefined) return value;
  if (defaultValue) return defaultValue;
  throw new InternalServerErrorException(`Environment variable ${key} not set`);
};
