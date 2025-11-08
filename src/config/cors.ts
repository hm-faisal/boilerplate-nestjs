import { corsDomains } from './allow-domain';

export const corsConfig = {
  origin: corsDomains,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
