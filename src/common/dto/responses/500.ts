import { ApiProperty } from '@nestjs/swagger';

class ErrorDetails {
  @ApiProperty({
    example: 'An unexpected error occurred.',
    description: 'A more detailed error message.',
  })
  message: string;

  @ApiProperty({
    example: 'Internal Server Error',
    description: 'A brief description of the error.',
  })
  error: string;

  @ApiProperty({ example: 500, description: 'The HTTP status code.' })
  statuscode: number;
}

export class InternalServerErrorResponse {
  @ApiProperty({
    example: false,
    description: 'Request status',
  })
  success: boolean;

  @ApiProperty({
    example: 500,
    description: 'The HTTP status code.',
  })
  statusCode: number;

  @ApiProperty({ description: 'The timestamp of the response.' })
  timestamp: Date;

  @ApiProperty({
    example: '/api/v1/users',
    description: 'The path of the request.',
  })
  path: string;

  @ApiProperty({
    example: 'GET',
    description: 'The HTTP method of the request.',
  })
  method: string;

  @ApiProperty({
    example: 'Internal Server Error',
    description: 'A brief description of the error.',
  })
  message: string;

  @ApiProperty({
    example: 'An unexpected error occurred.',
    description: 'A more detailed error message.',
  })
  error: string;

  @ApiProperty({
    type: ErrorDetails,
  })
  details: ErrorDetails;
}
