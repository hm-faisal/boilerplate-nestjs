import { allowedDomains } from './allow-domain';

export const corsConfig = {
  origin: process.env.NODE_ENV === 'production' ? allowedDomains : true, // Allow all in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'X-Request-ID'],
};
