import { Env } from 'src/utils/env';

export default () => ({
  DATABASE_URL: Env.get('DATABASE_URL'),
  PORT: Env.get('PORT', 8080),
  NODE_ENV: Env.get('NODE_ENV', 'development'),

  // Clients
  DASHBOARD_ORIGIN: Env.get('DASHBOARD_ORIGIN'),
  CLIENT_ORIGIN: Env.get('CLIENT_ORIGIN'),
});
