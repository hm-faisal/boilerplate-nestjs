import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Request, Response } from 'express';

interface PaginationMeta {
  total?: number;
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

interface StandardResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
  timestamp: string;
  path: string;
}

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  private readonly logger = new Logger(GlobalInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || 'Unknown';
    const startTime = Date.now();

    // Log incoming request
    this.logger.log(
      `Incoming Request: ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`,
    );

    return next.handle().pipe(
      map((responseData: unknown) => {
        // Transform response to standard format
        return this.transformResponse(responseData, request, response);
      }),
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          // Log successful response
          this.logger.log(
            `Outgoing Response: ${method} ${url} - Status: ${statusCode} - Duration: ${duration}ms`,
          );
        },
        error: (error: Error) => {
          const duration = Date.now() - startTime;

          // Log error response
          this.logger.error(
            `Failed Request: ${method} ${url} - Duration: ${duration}ms - Error: ${error.message}`,
            error.stack,
          );
        },
      }),
    );
  }

  private transformResponse(
    data: unknown,
    request: Request,
    response: Response,
  ): StandardResponse<unknown> {
    // If response is already in standard format, return as is
    if (this.isStandardResponse(data)) {
      return data;
    }

    // Extract message if present
    let message = 'Request successful';
    let responseData: unknown = data;
    let paginationMeta: PaginationMeta | undefined;

    // Check if data contains pagination properties
    if (this.isRecord(data)) {
      const paginationKeys = [
        'total',
        'page',
        'limit',
        'skip',
        'take',
        'totalPages',
        'hasNextPage',
        'hasPreviousPage',
      ];
      const hasPagination = paginationKeys.some((key) => key in data);

      if (hasPagination) {
        // Extract pagination metadata
        paginationMeta = this.extractPaginationMeta(data);

        // Extract actual data (usually in 'data' or 'items' property)
        if ('data' in data) {
          responseData = data.data;
          if ('message' in data && typeof data.message === 'string') {
            message = data.message;
          }
        } else if ('items' in data) {
          responseData = data.items;
          if ('message' in data && typeof data.message === 'string') {
            message = data.message;
          }
        } else if ('results' in data) {
          responseData = data.results;
          if ('message' in data && typeof data.message === 'string') {
            message = data.message;
          }
        } else {
          // Create a clean object without pagination keys
          const cleanData: Record<string, unknown> = {};
          for (const key in data) {
            if (!paginationKeys.includes(key) && key !== 'message') {
              cleanData[key] = data[key];
            }
          }
          responseData = Object.keys(cleanData).length > 0 ? cleanData : data;

          if ('message' in data && typeof data.message === 'string') {
            message = data.message;
          }
        }
      } else if ('message' in data && typeof data.message === 'string') {
        message = data.message;
        responseData = 'data' in data ? data.data : data;
      }
    }

    // Build standard response
    const standardResponse: StandardResponse<unknown> = {
      success: true,
      statusCode: response.statusCode,
      message,
      data: responseData,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Add pagination meta if present
    if (paginationMeta && Object.keys(paginationMeta).length > 0) {
      standardResponse.meta = paginationMeta;
    }

    return standardResponse;
  }

  private extractPaginationMeta(data: Record<string, unknown>): PaginationMeta {
    const meta: PaginationMeta = {};

    if ('total' in data && typeof data.total === 'number') {
      meta.total = data.total;
    }
    if ('page' in data && typeof data.page === 'number') {
      meta.page = data.page;
    }
    if ('limit' in data && typeof data.limit === 'number') {
      meta.limit = data.limit;
    }
    if ('skip' in data && typeof data.skip === 'number') {
      meta.skip = data.skip;
    }
    if ('take' in data && typeof data.take === 'number') {
      meta.take = data.take;
    }
    if ('totalPages' in data && typeof data.totalPages === 'number') {
      meta.totalPages = data.totalPages;
    }
    if ('hasNextPage' in data && typeof data.hasNextPage === 'boolean') {
      meta.hasNextPage = data.hasNextPage;
    }
    if (
      'hasPreviousPage' in data &&
      typeof data.hasPreviousPage === 'boolean'
    ) {
      meta.hasPreviousPage = data.hasPreviousPage;
    }

    return meta;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  private isStandardResponse(
    value: unknown,
  ): value is StandardResponse<unknown> {
    return (
      this.isRecord(value) &&
      'success' in value &&
      'statusCode' in value &&
      'message' in value &&
      'data' in value &&
      'timestamp' in value &&
      'path' in value
    );
  }
}

// Additional specialized interceptors you can use alongside the global one

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const method = request.method;
    const url = request.url;
    const body = request.body as unknown;
    const query = request.query;
    const params = request.params;
    const startTime = Date.now();

    this.logger.debug(`Request Details:
      Method: ${method}
      URL: ${url}
      Body: ${JSON.stringify(body)}
      Query: ${JSON.stringify(query)}
      Params: ${JSON.stringify(params)}
    `);

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          this.logger.debug(`Response sent in ${duration}ms`);
        },
      }),
    );
  }
}

// @Injectable()
// export class CacheControlInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
//     const ctx = context.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();

//     return next.handle().pipe(
//       tap(() => {
//         // Set cache headers for GET requests
//         if (request.method === 'GET') {
//           response.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes
//         } else {
//           response.setHeader('Cache-Control', 'no-store');
//         }
//       }),
//     );
//   }
// }

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TimeoutInterceptor.name);
  private readonly timeoutMs = 30000; // 30 seconds

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    return new Observable((observer) => {
      const timeout = setTimeout(() => {
        this.logger.warn(
          `Request timeout: ${request.method} ${request.url} exceeded ${this.timeoutMs}ms`,
        );
        observer.error(new Error('Request timeout'));
      }, this.timeoutMs);

      const subscription = next.handle().subscribe({
        next: (value: unknown) => {
          clearTimeout(timeout);
          observer.next(value);
        },
        error: (err: Error) => {
          clearTimeout(timeout);
          observer.error(err);
        },
        complete: () => {
          clearTimeout(timeout);
          observer.complete();
        },
      });

      return () => {
        clearTimeout(timeout);
        subscription.unsubscribe();
      };
    });
  }
}

@Injectable()
export class SanitizeResponseInterceptor implements NestInterceptor {
  private readonly sensitiveFields = [
    'password',
    'passwordHash',
    'salt',
    'token',
    'refreshToken', // FIXME: check based on auth use cookie based or bearer auth
    'accessToken', // FIXME: check based on auth use cookie based or bearer auth
    'secret',
    'apiKey',
  ];

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((data: unknown) => this.sanitize(data)));
  }

  private sanitize(data: unknown): unknown {
    if (data === null || data === undefined) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item: unknown) => this.sanitize(item));
    }

    if (typeof data === 'object') {
      const sanitized: Record<string, unknown> = {};
      const dataRecord = data as Record<string, unknown>;

      for (const key of Object.keys(dataRecord)) {
        if (this.sensitiveFields.includes(key)) {
          continue; // Skip sensitive fields
        } else if (typeof dataRecord[key] === 'object') {
          sanitized[key] = this.sanitize(dataRecord[key]);
        } else {
          sanitized[key] = dataRecord[key];
        }
      }

      return sanitized;
    }

    return data;
  }
}
